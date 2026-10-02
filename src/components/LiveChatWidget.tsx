'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Loader2,
  LogOut,
  MessageSquare,
  Send,
  ShieldAlert,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

function decodeVapidKey(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  const bytes = Uint8Array.from(raw, (character) => character.charCodeAt(0));
  return bytes.buffer as ArrayBuffer;
}

interface ChatMessage {
  id: string;
  thread_id: string;
  sender_type: 'user' | 'admin';
  text: string;
  created_at: string;
  expires_at: string;
}

interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  token: string;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [pushStatus, setPushStatus] = useState<'checking' | 'prompt' | 'granted' | 'blocked'>('checking');
  const [isPushBusy, setIsPushBusy] = useState(false);

  useEffect(() => {
    const checkPushStatus = async () => {
      const supported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      if (!supported) {
        setPushStatus('blocked');
        return;
      }
      if (Notification.permission === 'granted') {
        setPushStatus('granted');
      } else if (Notification.permission === 'denied') {
        setPushStatus('blocked');
      } else {
        setPushStatus('prompt');
      }
    };
    void checkPushStatus();
  }, []);

  const handleEnablePushNotifications = async () => {
    setIsPushBusy(true);
    try {
      const permission = Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushStatus(permission === 'denied' ? 'blocked' : 'prompt');
        return;
      }
      const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/' });
      const { data, error } = await supabase.functions.invoke('push-notifications', { body: { action: 'public_key' } });
      if (error || typeof data?.public_key !== 'string') throw new Error('Push not configured');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeVapidKey(data.public_key),
      });
      await supabase.functions.invoke('push-notifications', {
        body: { action: 'subscribe', subscription: subscription.toJSON() },
      });
      setPushStatus('granted');
    } catch (err) {
      console.error('Error enabling push notifications:', err);
    } finally {
      setIsPushBusy(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check screen size for desktop vs mobile drag
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Listen to Supabase Auth state
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (currentSession?.user) {
        const u = currentSession.user;
        setSession({
          id: u.id,
          email: u.email || '',
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          avatar: u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
          token: currentSession.access_token,
        });
      } else {
        setSession(null);
      }
      setIsAuthLoading(false);
    };

    void checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      if (newSession?.user) {
        const u = newSession.user;
        setSession({
          id: u.id,
          email: u.email || '',
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          avatar: u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
          token: newSession.access_token,
        });
      } else {
        setSession(null);
        setMessages([]);
        setThreadId(null);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Check for existing thread & unread status when session is active
  useEffect(() => {
    if (!session) return;
    let isMounted = true;

    const checkUnread = async () => {
      const { data: threadData } = await supabase
        .from('chat_threads')
        .select('id, unread_by_user')
        .eq('user_id', session.id)
        .maybeSingle();

      if (!isMounted) return;

      if (threadData) {
        setThreadId(threadData.id);
        if (threadData.unread_by_user && !isOpen) {
          setHasNotification(true);
        }
      }
    };

    void checkUnread();
    return () => {
      isMounted = false;
    };
  }, [session, isOpen]);

  // Load existing messages when session is active and widget is open
  useEffect(() => {
    if (!session || !isOpen) return;

    let isMounted = true;

    const fetchThreadAndMessages = async () => {
      setIsLoadingMessages(true);
      setErrorNotice(null);

      try {
        // Fetch thread
        const { data: threadData } = await supabase
          .from('chat_threads')
          .select('id')
          .eq('user_id', session.id)
          .maybeSingle();

        if (!isMounted) return;

        if (threadData?.id) {
          setThreadId(threadData.id);

          // Fetch active messages
          const { data: msgsData } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('thread_id', threadData.id)
            .order('created_at', { ascending: true });

          if (isMounted) {
            setMessages((msgsData ?? []) as ChatMessage[]);
            setHasNotification(false);
          }

          // Mark unread_by_user = false
          await supabase
            .from('chat_threads')
            .update({ unread_by_user: false })
            .eq('id', threadData.id);
        }
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    };

    void fetchThreadAndMessages();

    return () => {
      isMounted = false;
    };
  }, [session, isOpen]);

  // Realtime subscription for incoming messages
  useEffect(() => {
    if (!threadId) return;

    const channel = supabase
      .channel(`user_thread:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (newMsg.sender_type === 'admin' && !isOpen) {
            setHasNotification(true);
          }
          if (isOpen) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [threadId, isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  // Auto-close popup window if running inside an OAuth popup callback
  useEffect(() => {
    if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
      const checkSession = async () => {
        const { data: { session: popupSession } } = await supabase.auth.getSession();
        if (popupSession) {
          window.close();
        }
      };
      void checkSession();
    }
  }, []);

  // Trigger Google OAuth Login in a centered popup window
  const handleGoogleSignIn = async () => {
    setErrorNotice(null);
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.href : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
          redirectTo: redirectUrl,
        },
      });

      if (error || !data?.url) {
        setErrorNotice('Google sign-in could not be initiated. Please try again.');
        return;
      }

      // Calculate center position for popup window
      const width = 520;
      const height = 650;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      const popup = window.open(
        data.url,
        'GoogleSignInPopup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        // Fallback to normal browser redirect if popup was blocked by browser
        window.location.href = data.url;
        return;
      }

      // Poll popup closure or session updates
      const timer = setInterval(async () => {
        if (popup.closed) {
          clearInterval(timer);
          const { data: { session: newSession } } = await supabase.auth.getSession();
          if (newSession?.user) {
            const u = newSession.user;
            setSession({
              id: u.id,
              email: u.email || '',
              name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
              avatar: u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
              token: newSession.access_token,
            });
          }
        }
      }, 500);

      // Listen for auth state change to close popup automatically when signed in
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession?.user && popup && !popup.closed) {
          popup.close();
          clearInterval(timer);
          authListener.subscription.unsubscribe();
        }
      });
    } catch (err) {
      console.error('Google Popup Error:', err);
      setErrorNotice('Google sign-in popup error. Please try again.');
    }
  };

  // Sign out user
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Send message
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const { data: { session: freshSession } } = await supabase.auth.getSession();
    const tokenToUse = freshSession?.access_token || session?.token;

    if (!tokenToUse) {
      setErrorNotice('Your session has expired. Please sign in again.');
      return;
    }

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);
    setErrorNotice(null);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenToUse}`,
        },
        body: JSON.stringify({ text: textToSend }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setErrorNotice('You are sending messages too quickly. Please wait a moment.');
        } else {
          setErrorNotice(data.error || 'Failed to send message.');
        }
        setInputText(textToSend); // Restore text on failure
        return;
      }

      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }

      if (data.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message as ChatMessage];
        });
      }
    } catch (err) {
      console.error('Send error:', err);
      setErrorNotice('Connection error. Please try again.');
      setInputText(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(new Date(dateStr));
    } catch {
      return '';
    }
  };

  const toggleWidget = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        setHasNotification(false);
        window.dispatchEvent(new Event('push-opt-in:open'));
      }
      return nextState;
    });
  };

  return (
    <>
      {/* Floating Draggable FAB Button */}
      <motion.div
        drag={isDesktop}
        dragConstraints={{ left: -300, right: 20, top: -500, bottom: 20 }}
        dragElastic={0.1}
        className="fixed bottom-6 right-6 z-[99] touch-none select-none"
      >
        <button
          type="button"
          onClick={toggleWidget}
          aria-label={isOpen ? 'Close Live Help Desk' : 'Open Live Help Desk'}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4A2F] text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#0B3B24] active:scale-95"
        >
          {isOpen ? (
            <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}

          {/* Pulse Indicator - Shown ONLY when closed AND there is an unread notification */}
          {!isOpen && hasNotification && (
            <span className="absolute right-0 top-0 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#25D366]" />
            </span>
          )}
        </button>
      </motion.div>

      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-[100] flex h-[580px] max-h-[85vh] w-[calc(100vw-32px)] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl"
          >
            {/* Header Bar */}
            <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-[#0F4A2F] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight">Carnival Live Help Desk</h3>
                  <p className="text-[11px] font-medium text-white/70">Direct connection to Support Team</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {session && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    aria-label="Sign out"
                    title="Sign out of Help Desk"
                    className="grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Chat Window"
                  className="grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            {/* 24-Hour Ephemeral Notice Bar */}
            <div className="shrink-0 border-b border-[#FCE6A8] bg-[#FEF3D6] px-4 py-2.5 text-xs text-[#8D6B1B]">
              <div className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p className="leading-snug font-semibold">
                  Notice: For privacy and operational efficiency, all messages are automatically purged 24 hours after delivery.
                </p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAFBF9] p-4">
              {isAuthLoading ? (
                <div className="grid flex-1 place-items-center text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : !session ? (
                /* Authentication Gate Card */
                <div className="my-auto flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#D8EADF] text-[#0F4A2F]">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-sm font-bold text-slate-900">Sign-in Required</h4>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Sign in with your Google account to send a message to our support team.
                  </p>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              ) : (
                /* Active Chat Interface */
                <div className="flex flex-1 flex-col space-y-4">
                  {/* User Profile Bar */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {session.avatar ? (
                        <Image
                          src={session.avatar}
                          alt=""
                          width={28}
                          height={28}
                          className="rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-[#D8EADF] text-[11px] font-bold text-[#0F4A2F] shrink-0">
                          {session.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="truncate text-xs font-bold text-slate-800">{session.name}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#0F4A2F] bg-[#D8EADF] px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Connected
                    </span>
                  </div>

                  {/* Push Notification Support Reply Banner */}
                  {pushStatus === 'prompt' && (
                    <div className="flex items-center justify-between rounded-xl border border-[#E4B03A]/40 bg-[#FFFDF3] p-2.5 shadow-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <Bell className="h-4 w-4 shrink-0 text-[#8D6B1B]" />
                        <span className="text-[11px] font-semibold text-[#35453A] leading-tight">
                          Allow notifications to know when support replies you
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleEnablePushNotifications}
                        disabled={isPushBusy}
                        className="shrink-0 rounded-lg bg-[#0F4A2F] px-3 py-1.5 text-[11px] font-extrabold text-white shadow-xs transition hover:bg-[#0B3B24] disabled:opacity-50"
                      >
                        {isPushBusy ? 'Enabling…' : 'Allow'}
                      </button>
                    </div>
                  )}

                  {pushStatus === 'granted' && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#EAF2EA] px-2.5 py-1 text-[10px] font-bold text-[#0F4A2F] w-fit">
                      <Bell className="h-3 w-3 text-[#0F4A2F]" />
                      <span>Reply notifications active</span>
                    </div>
                  )}

                  {/* Messages Feed */}
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                    {isLoadingMessages ? (
                      <div className="grid h-32 place-items-center text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="my-8 text-center text-xs text-slate-500">
                        <p className="font-semibold text-slate-700">No recent messages</p>
                        <p className="mt-1">Type your enquiry below to start live support.</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isUser = msg.sender_type === 'user';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[85%] p-3 text-sm leading-relaxed shadow-sm ${
                                isUser
                                  ? 'rounded-2xl rounded-tr-sm bg-[#F4F6F4] text-[#111827] border border-slate-200'
                                  : 'rounded-2xl rounded-tl-sm bg-[#0F4A2F] text-white'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                            <span className="mt-1 text-[10px] text-slate-400">
                              {formatMessageTime(msg.created_at)}
                            </span>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}

              {/* Error Notice */}
              {errorNotice && (
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{errorNotice}</span>
                </div>
              )}
            </div>

            {/* Input Bar (Only Enabled when Authenticated) */}
            {session && (
              <form
                onSubmit={handleSendMessage}
                className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white p-3"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="h-10 flex-1 rounded-xl border border-slate-200 bg-[#F8FAF8] px-3 text-xs outline-none focus:border-[#0F4A2F] focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  aria-label="Send Message"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-[#0F4A2F] text-white shadow-button transition hover:bg-[#0B3B24] disabled:opacity-50 shrink-0"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
