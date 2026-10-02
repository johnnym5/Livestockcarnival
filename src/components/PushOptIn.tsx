'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, BellOff, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

type PushState = 'checking' | 'unsupported' | 'prompt' | 'unsubscribed' | 'subscribed' | 'blocked';

function decodeVapidKey(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  const bytes = Uint8Array.from(raw, (character) => character.charCodeAt(0));
  return bytes.buffer as ArrayBuffer;
}

export default function PushOptIn() {
  const [state, setState] = useState<PushState>('checking');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptDelayElapsed, setPromptDelayElapsed] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setPromptDelayElapsed(true), 10_000);
    return () => window.clearTimeout(timer);
  }, []);

  const canShowPrompt = () => {
    try {
      return window.sessionStorage.getItem('livestock-push-prompt-dismissed') !== '1'
        && window.localStorage.getItem('livestock-push-opted-out') !== '1';
    } catch { return true; }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    try { window.sessionStorage.setItem('livestock-push-prompt-dismissed', '1'); } catch { /* Storage may be unavailable. */ }
  };

  useEffect(() => {
    let active = true;
    const check = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      if (!supported) {
        if (active) {
          setState('unsupported');
          const needsHomeScreen = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(navigator as Navigator & { standalone?: boolean }).standalone;
          if (needsHomeScreen) {
            setShowPrompt(canShowPrompt());
          }
        }
        return;
      }
      try {
        const registration = await navigator.serviceWorker.getRegistration('/');
        const subscription = await registration?.pushManager.getSubscription();
        if (!active) return;
        if (subscription) setState('subscribed');
        else if (Notification.permission === 'denied') setState('blocked');
        else if (Notification.permission === 'default') {
          setState('prompt');
          setShowPrompt(canShowPrompt());
        } else {
          setState('unsubscribed');
          setShowPrompt(canShowPrompt());
        }
      } catch {
        if (active) {
          const permissionState = Notification.permission === 'denied' ? 'blocked' : Notification.permission === 'default' ? 'prompt' : 'unsubscribed';
          setState(permissionState);
          if (permissionState === 'prompt') {
            setShowPrompt(canShowPrompt());
          } else if (permissionState === 'unsubscribed') {
            setShowPrompt(canShowPrompt());
          }
        }
      }
    };
    void check();
    const refreshPermission = () => { if (document.visibilityState === 'visible') void check(); };
    document.addEventListener('visibilitychange', refreshPermission);
    window.addEventListener('focus', refreshPermission);
    return () => {
      active = false;
      document.removeEventListener('visibilitychange', refreshPermission);
      window.removeEventListener('focus', refreshPermission);
    };
  }, []);

  const subscribe = async () => {
    setBusy(true); setNotice('');
    try {
      // Request permission directly from this click to satisfy browser gesture requirements.
      const permission = Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission();
      if (permission !== 'granted') { setState(permission === 'denied' ? 'blocked' : 'prompt'); return; }
      const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/' });
      const { data, error } = await supabase.functions.invoke('push-notifications', { body: { action: 'public_key' } });
      if (error || typeof data?.public_key !== 'string') throw new Error('Notifications are not configured yet.');
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeVapidKey(data.public_key) });
      const { error: saveError } = await supabase.functions.invoke('push-notifications', { body: { action: 'subscribe', subscription: subscription.toJSON() } });
      if (saveError) { await subscription.unsubscribe(); throw saveError; }
      setState('subscribed'); setShowPrompt(false); setNotice('You’re subscribed to official carnival updates.');
      try { window.localStorage.removeItem('livestock-push-opted-out'); } catch { /* Storage may be unavailable. */ }
    } catch {
      setNotice('Notifications could not be enabled. Please try again later.');
    } finally { setBusy(false); }
  };

  const unsubscribe = async () => {
    setBusy(true); setNotice('');
    try {
      const registration = await navigator.serviceWorker.getRegistration('/');
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        const endpoint = subscription.endpoint;
        const { error } = await supabase.functions.invoke('push-notifications', { body: { action: 'unsubscribe', endpoint } });
        if (error) throw error;
        await subscription.unsubscribe();
      }
      dismissPrompt();
      try { window.localStorage.setItem('livestock-push-opted-out', '1'); } catch { /* Storage may be unavailable. */ }
      setState('unsubscribed'); setNotice('You have unsubscribed from browser notifications.');
    } catch {
      setNotice('We could not remove this subscription. Please try again.');
    } finally { setBusy(false); }
  };

  if (state === 'checking') return null;
  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(navigator as Navigator & { standalone?: boolean }).standalone;
  const showInstallPrompt = isIos && state === 'unsupported' && showPrompt && promptDelayElapsed;
  const showBrowserPrompt = !isIos && (state === 'prompt' || state === 'unsubscribed') && showPrompt && promptDelayElapsed;

  return (
    <>
    <AnimatePresence>
      {(showBrowserPrompt || showInstallPrompt) && <motion.div key="push-opt-in-backdrop" className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#302b22]/35 px-4 py-8 backdrop-blur-[5px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.7 }}>
        <motion.aside role="dialog" aria-modal="true" aria-labelledby="push-opt-in-title" className="relative my-auto w-full max-w-lg overflow-hidden rounded-[28px] border border-white/70 bg-[#f4eddd]/85 p-6 text-[#19251C] shadow-[0_28px_100px_rgba(36,30,20,.28)] backdrop-blur-2xl sm:p-8" initial={{ opacity: 0, y: reduceMotion ? 0 : -72, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -24, scale: 0.98 }} transition={{ duration: reduceMotion ? 0.01 : 0.95, ease: [0.22, 1, 0.36, 1] }}>
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#E4B03A]/20 blur-3xl" />
          <button type="button" aria-label="Close notification prompt" onClick={dismissPrompt} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-[#776b53]/15 bg-white/35 text-[#465247] transition hover:bg-white/70"><X className="h-4 w-4" /></button>
          <div className="relative">
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#8D6B1B]">Stay in the celebration</p>
            <h2 id="push-opt-in-title" className="mt-2 pr-10 text-2xl font-black tracking-tight sm:text-3xl">Get official carnival updates</h2>
            {showInstallPrompt ? <><p className="mt-3 text-sm leading-6 text-[#5D685F]">To receive notifications on iPhone or iPad, use Share → Add to Home Screen, then open this site from its Home Screen icon.</p><button type="button" onClick={dismissPrompt} className="mt-6 min-h-11 rounded-xl bg-[#1E4D38] px-5 text-xs font-bold text-white">Got it</button></> : <><p className="mt-3 text-sm leading-6 text-[#5D685F]">{state === 'prompt' ? 'Get important event announcements and new story alerts on this device. You can unsubscribe at any time.' : 'Browser permission is already allowed. Activate notifications to receive event announcements and new story alerts.'}</p><div className="mt-6 flex flex-wrap items-center gap-2"><button type="button" disabled={busy} onClick={() => { dismissPrompt(); void subscribe(); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1E4D38] px-5 text-xs font-bold text-white shadow-sm transition hover:bg-[#143c2b] disabled:opacity-60"><Bell className="h-4 w-4" />{busy ? 'Working…' : state === 'prompt' ? 'Allow notifications' : 'Activate updates'}</button><button type="button" onClick={dismissPrompt} className="min-h-11 rounded-xl px-4 text-xs font-semibold text-[#667168] transition hover:bg-white/50">Not now</button></div></>}
          </div>
        </motion.aside>
      </motion.div>}
    </AnimatePresence>
    <section aria-label="Browser notification settings" className="border-t border-[#E4B03A]/25 bg-[#F7F4E9] px-5 py-8 text-[#19251C] sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl"><p className="flex items-center gap-2 text-sm font-extrabold"><Bell className="h-4 w-4 text-[#8D6B1B]" /> Official carnival browser updates</p><p className="mt-1 text-xs leading-5 text-[#5D685F]">If you subscribe, this site stores your browser push address and sends official event announcements. You can unsubscribe here or in your browser settings. See our <Link href="/privacy" className="font-semibold text-[#1E4D38] underline">Privacy Policy</Link>.</p>{isIos && <p className="mt-2 text-xs font-semibold text-[#8D6B1B]">On iPhone or iPad, add this site to your Home Screen and open it from the new icon before subscribing.</p>}{notice && <p role="status" className="mt-2 text-xs font-semibold text-[#1E4D38]">{notice}</p>}</div>
        {state === 'unsupported' ? <p className="text-xs text-[#667168]">This browser does not support push notifications. You can still check announcements on our website.</p> : state === 'blocked' ? <p className="max-w-xs text-xs leading-5 text-[#667168]">Notifications are blocked for this site. Allow them in your browser’s site settings, then return here and reload.</p> : isIos ? <p className="text-xs font-semibold text-[#8D6B1B]">Add to Home Screen to enable</p> : <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end"><button type="button" disabled={busy} onClick={() => void (state === 'subscribed' ? unsubscribe() : subscribe())} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#1E4D38] px-4 text-xs font-bold text-[#1E4D38] transition hover:bg-[#E6EFE8] disabled:opacity-60">{state === 'subscribed' ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}{busy ? 'Working…' : state === 'subscribed' ? 'Unsubscribe' : state === 'prompt' ? 'Allow notifications' : 'Activate updates'}</button>{state === 'prompt' && <span className="max-w-56 text-[10px] leading-4 text-[#758078]">Your browser will ask for permission when you tap.</span>}{state === 'unsubscribed' && <span className="max-w-56 text-right text-[10px] leading-4 text-[#758078]">Browser permission is allowed; tap to activate updates.</span>}</div>}
      </div>
    </section>
    </>
  );
}
