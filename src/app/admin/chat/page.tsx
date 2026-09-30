'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Loader2,
  LogOut,
  MessageSquare,
  Newspaper,
  Search,
  Send,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { CmsProfile } from '@/lib/cms';
import { supabase } from '@/lib/supabase/client';

interface ChatThread {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_avatar: string | null;
  last_message_text: string | null;
  last_message_timestamp: string | null;
  unread_by_admin: boolean;
  unread_by_user: boolean;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  thread_id: string;
  sender_type: 'user' | 'admin';
  text: string;
  created_at: string;
  expires_at: string;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return '';
  }
};

export default function AdminLiveChatPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CmsProfile | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Authenticate session and check admin role
  useEffect(() => {
    let active = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('cms_users')
        .select('user_id,email,display_name,role,created_at')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        await supabase.auth.signOut();
        router.replace('/admin/login');
        return;
      }

      if (active) {
        setProfile(profileData as CmsProfile);
      }

      // Fetch threads
      const { data: threadsData, error: threadsError } = await supabase
        .from('chat_threads')
        .select('*')
        .order('updated_at', { ascending: false });

      if (active) {
        if (threadsError) {
          setErrorNotice('Unable to load chat threads. Confirm database migrations have been applied.');
        } else {
          setThreads((threadsData ?? []) as ChatThread[]);
          if (threadsData && threadsData.length > 0) {
            setSelectedThread(threadsData[0] as ChatThread);
          }
        }
        setIsLoading(false);
      }
    };

    void init();

    return () => {
      active = false;
    };
  }, [router]);

  // Realtime subscription for threads list updates
  useEffect(() => {
    const channel = supabase
      .channel('admin_chat_threads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_threads' },
        async () => {
          const { data: updatedThreads } = await supabase
            .from('chat_threads')
            .select('*')
            .order('updated_at', { ascending: false });

          if (updatedThreads) {
            setThreads(updatedThreads as ChatThread[]);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // Fetch messages when selected thread changes & listen for realtime messages
  useEffect(() => {
    if (!selectedThread) return;

    let isMounted = true;

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      const { data: msgsData } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true });

      if (isMounted) {
        setMessages((msgsData ?? []) as ChatMessage[]);
        setIsLoadingMessages(false);
      }

      // Mark unread_by_admin = false
      if (selectedThread.unread_by_admin) {
        await supabase
          .from('chat_threads')
          .update({ unread_by_admin: false })
          .eq('id', selectedThread.id);

        setThreads((prev) =>
          prev.map((t) => (t.id === selectedThread.id ? { ...t, unread_by_admin: false } : t))
        );
      }
    };

    void loadMessages();

    // Subscribe to messages in this active thread
    const messageChannel = supabase
      .channel(`admin_thread:${selectedThread.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `thread_id=eq.${selectedThread.id}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      void supabase.removeChannel(messageChannel);
    };
  }, [selectedThread]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Filtered and paginated threads
  const filteredThreads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return threads;
    return threads.filter(
      (t) =>
        t.user_name.toLowerCase().includes(query) ||
        t.user_email.toLowerCase().includes(query) ||
        (t.last_message_text && t.last_message_text.toLowerCase().includes(query))
    );
  }, [threads, searchQuery]);

  const paginatedThreads = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredThreads.slice(start, start + pageSize);
  }, [filteredThreads, pageIndex, pageSize]);

  const totalPages = Math.ceil(filteredThreads.length / pageSize) || 1;

  // Send official admin reply
  const handleSendReply = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread || isSendingReply) return;

    const textToSend = replyText.trim();
    setReplyText('');
    setIsSendingReply(true);

    try {
      // Insert message as admin
      const { data: insertedMsg, error: msgError } = await supabase
        .from('chat_messages')
        .insert({
          thread_id: selectedThread.id,
          sender_type: 'admin',
          text: textToSend,
        })
        .select('*')
        .single();

      if (msgError || !insertedMsg) {
        throw new Error('Could not send official reply.');
      }

      // Update thread
      await supabase
        .from('chat_threads')
        .update({
          last_message_text: textToSend,
          last_message_timestamp: new Date().toISOString(),
          unread_by_admin: false,
          unread_by_user: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedThread.id);

      setMessages((prev) => [...prev, insertedMsg as ChatMessage]);
    } catch (err) {
      console.error('Reply error:', err);
      setErrorNotice('Failed to send reply. Please try again.');
      setReplyText(textToSend);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (isLoading || !profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F3F5F2] text-[#33413A]">
        <p className="text-sm font-semibold">Loading Live Help Desk Console…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F5F2] text-[#17251D] lg:flex">
      {/* Sidebar Navigation */}
      <aside className="flex shrink-0 flex-col bg-[#0B1B11] px-4 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:px-5 lg:py-7">
        <Link href="/admin" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#E4B03A]/35 bg-[#E4B03A]/10 text-[#E4B03A]">
            <Newspaper className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-extrabold tracking-tight">Carnival Desk</span>
            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              Admin console
            </span>
          </span>
        </Link>

        <nav className="flex gap-2 lg:flex-col" aria-label="Admin sections">
          <Link
            href="/admin"
            className="flex min-h-11 flex-1 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/55 hover:bg-white/5 hover:text-white transition lg:flex-none"
          >
            <FileText className="h-4 w-4" /> Stories
          </Link>

          <Link
            href="/admin/chat"
            className="flex min-h-11 flex-1 items-center gap-3 rounded-xl bg-white/10 px-3 text-sm font-semibold text-white transition lg:flex-none"
          >
            <MessageSquare className="h-4 w-4" /> Live Support Chat
          </Link>

          {profile.role === 'super_admin' && (
            <Link
              href="/admin?view=team"
              className="flex min-h-11 flex-1 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/55 hover:bg-white/5 hover:text-white transition lg:flex-none"
            >
              <Users className="h-4 w-4" /> Team access
            </Link>
          )}
        </nav>

        <div className="mt-6 hidden rounded-xl border border-white/10 bg-white/[0.04] p-3 lg:block">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E4B03A]">
            <ShieldCheck className="h-4 w-4" />
            {profile.role === 'super_admin' ? 'Super admin' : 'Editorial access'}
          </div>
          <p className="mt-2 truncate text-xs text-white/55">{profile.email}</p>
        </div>

        <div className="mt-auto hidden border-t border-white/10 pt-5 lg:block">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-xs font-semibold text-white/55 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-[#E3E8E2] bg-[#F3F5F2]/90 px-4 backdrop-blur-xl sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8D6B1B]">
              Secretariat Support
            </p>
            <h1 className="mt-0.5 text-lg font-extrabold tracking-tight">Live Support Chat Console</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-xs font-semibold text-[#5B675F] sm:block">
              {profile.email}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#DDE4DC] bg-white text-[#4F5D53] transition hover:border-rose-200 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Error Notice */}
        {errorNotice && (
          <div className="mx-4 mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 sm:mx-8">
            {errorNotice}
          </div>
        )}

        {/* Two-Pane Workspace Layout */}
        <div className="flex flex-1 flex-col overflow-hidden p-4 sm:p-8 lg:flex-row gap-6">
          {/* Left Pane (35% Width): Active Threads Inbox */}
          <section className="flex flex-col rounded-2xl border border-[#E1E7E0] bg-white shadow-sm lg:w-[35%] shrink-0 overflow-hidden h-[680px]">
            {/* Header & Search Bar */}
            <div className="border-b border-[#E9EDE8] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-[#17251D]">Active Threads</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold">Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPageIndex(0);
                    }}
                    className="h-8 rounded-lg border border-[#DDE4DC] bg-[#FBFCFA] px-2 text-xs font-semibold outline-none focus:border-[#0F4A2F]"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name or email..."
                  className="h-9 w-full rounded-xl border border-[#DDE4DC] bg-[#FBFCFA] pl-9 pr-3 text-xs outline-none focus:border-[#0F4A2F]"
                />
              </div>
            </div>

            {/* Thread List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#EEF1ED]">
              {paginatedThreads.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 px-4">
                  <p className="font-semibold text-slate-700">No active support threads</p>
                  <p className="mt-1">Messages submitted by public users will appear here.</p>
                </div>
              ) : (
                paginatedThreads.map((thread) => {
                  const isSelected = selectedThread?.id === thread.id;
                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => setSelectedThread(thread)}
                      className={`flex w-full items-start gap-3 p-4 text-left transition ${
                        isSelected
                          ? 'bg-[#F1F8F2] border-l-4 border-l-[#0F4A2F]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {thread.user_avatar ? (
                          <Image
                            src={thread.user_avatar}
                            alt=""
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#D8EADF] text-xs font-bold text-[#0F4A2F]">
                            {thread.user_name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Unread Indicator Badge */}
                        {thread.unread_by_admin && (
                          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#0F4A2F]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="truncate text-xs font-extrabold text-slate-900">
                            {thread.user_name}
                          </p>
                          <span className="shrink-0 text-[10px] text-slate-400">
                            {formatDate(thread.last_message_timestamp)}
                          </span>
                        </div>
                        <p className="truncate text-[11px] text-slate-500 mt-0.5">
                          {thread.user_email}
                        </p>
                        <p className="line-clamp-1 text-xs text-slate-700 mt-1 font-medium">
                          {thread.last_message_text || 'No messages yet.'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex items-center justify-between border-t border-[#E9EDE8] bg-[#FBFCFA] p-3 text-xs font-semibold text-slate-600">
              <span>
                Page {pageIndex + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pageIndex === 0}
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={pageIndex >= totalPages - 1}
                  onClick={() => setPageIndex((p) => p + 1)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </section>

          {/* Right Pane (65% Width): Selected Message Thread & Reply Bar */}
          <section className="flex flex-col rounded-2xl border border-[#E1E7E0] bg-white shadow-sm lg:w-[65%] flex-1 overflow-hidden h-[680px]">
            {selectedThread ? (
              <>
                {/* Selected User Top Header */}
                <header className="flex shrink-0 items-center justify-between border-b border-[#E9EDE8] bg-[#FBFCFA] p-4">
                  <div className="flex items-center gap-3">
                    {selectedThread.user_avatar ? (
                      <Image
                        src={selectedThread.user_avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#D8EADF] text-sm font-bold text-[#0F4A2F] shrink-0">
                        {selectedThread.user_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {selectedThread.user_name}
                      </h3>
                      <p className="text-xs text-slate-500">{selectedThread.user_email}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D8EADF] px-3 py-1 text-xs font-bold text-[#0F4A2F]">
                    <span className="h-2 w-2 rounded-full bg-[#0F4A2F]" /> Active Thread
                  </span>
                </header>

                {/* Messages Transcript */}
                <div className="flex-1 space-y-4 overflow-y-auto bg-[#FAFBF9] p-6">
                  {isLoadingMessages ? (
                    <div className="grid h-48 place-items-center text-slate-400">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-20 text-center text-xs text-slate-500">
                      No messages in this thread yet.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isAdmin = msg.sender_type === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {isAdmin ? 'Official Secretariat Reply' : selectedThread.user_name}
                            </span>
                          </div>
                          <div
                            className={`max-w-[80%] p-3.5 text-sm leading-relaxed shadow-sm ${
                              isAdmin
                                ? 'rounded-2xl rounded-tr-sm bg-[#0F4A2F] text-white'
                                : 'rounded-2xl rounded-tl-sm bg-white border border-slate-200 text-slate-800'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          </div>
                          <span className="mt-1 text-[10px] text-slate-400">
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Official Reply Input Bar */}
                <form
                  onSubmit={handleSendReply}
                  className="flex shrink-0 items-center gap-3 border-t border-[#E9EDE8] bg-white p-4"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official secretariat reply..."
                    disabled={isSendingReply}
                    className="h-11 flex-1 rounded-xl border border-slate-200 bg-[#F8FAF8] px-4 text-xs outline-none focus:border-[#0F4A2F] focus:bg-white font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSendingReply}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0F4A2F] px-5 text-xs font-bold text-white shadow-button transition hover:bg-[#0B3B24] disabled:opacity-50 shrink-0"
                  >
                    {isSendingReply ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Official Reply
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="my-auto flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                  <User className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No Thread Selected</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Choose a user support thread from the left inbox to view the conversation and send official replies.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
