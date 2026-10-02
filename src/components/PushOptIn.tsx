'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, BellOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

type PushState = 'checking' | 'unsupported' | 'unsubscribed' | 'subscribed' | 'blocked';

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

  useEffect(() => {
    let active = true;
    const check = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      if (!supported) { if (active) setState('unsupported'); return; }
      try {
        const registration = await navigator.serviceWorker.getRegistration('/');
        const subscription = await registration?.pushManager.getSubscription();
        if (active) setState(subscription ? 'subscribed' : Notification.permission === 'denied' ? 'blocked' : 'unsubscribed');
      } catch {
        if (active) setState('unsubscribed');
      }
    };
    void check();
    return () => { active = false; };
  }, []);

  const subscribe = async () => {
    setBusy(true); setNotice('');
    try {
      // Request permission directly from this click to satisfy browser gesture requirements.
      const permissionPromise = Notification.requestPermission();
      const permission = await permissionPromise;
      if (permission !== 'granted') { setState(permission === 'denied' ? 'blocked' : 'unsubscribed'); return; }
      const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/' });
      const { data, error } = await supabase.functions.invoke('push-notifications', { body: { action: 'public_key' } });
      if (error || typeof data?.public_key !== 'string') throw new Error('Notifications are not configured yet.');
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeVapidKey(data.public_key) });
      const { error: saveError } = await supabase.functions.invoke('push-notifications', { body: { action: 'subscribe', subscription: subscription.toJSON() } });
      if (saveError) { await subscription.unsubscribe(); throw saveError; }
      setState('subscribed'); setNotice('You’re subscribed to official carnival updates.');
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
      setState('unsubscribed'); setNotice('You have unsubscribed from browser notifications.');
    } catch {
      setNotice('We could not remove this subscription. Please try again.');
    } finally { setBusy(false); }
  };

  if (state === 'checking') return null;
  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(navigator as Navigator & { standalone?: boolean }).standalone;

  return (
    <section aria-label="Browser notification settings" className="border-t border-[#E4B03A]/25 bg-[#F7F4E9] px-5 py-8 text-[#19251C] sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl"><p className="flex items-center gap-2 text-sm font-extrabold"><Bell className="h-4 w-4 text-[#8D6B1B]" /> Official carnival browser updates</p><p className="mt-1 text-xs leading-5 text-[#5D685F]">If you subscribe, this site stores your browser push address and sends official event announcements. You can unsubscribe here or in your browser settings. See our <Link href="/privacy" className="font-semibold text-[#1E4D38] underline">Privacy Policy</Link>.</p>{isIos && <p className="mt-2 text-xs font-semibold text-[#8D6B1B]">On iPhone or iPad, add this site to your Home Screen and open it from the new icon before subscribing.</p>}{notice && <p role="status" className="mt-2 text-xs font-semibold text-[#1E4D38]">{notice}</p>}</div>
        {state === 'unsupported' ? <p className="text-xs text-[#667168]">This browser does not support push notifications. You can still check announcements on our website.</p> : state === 'blocked' ? <p className="text-xs text-[#667168]">Notifications are blocked in your browser settings.</p> : isIos ? <p className="text-xs font-semibold text-[#8D6B1B]">Add to Home Screen to enable</p> : <button type="button" disabled={busy} onClick={() => void (state === 'subscribed' ? unsubscribe() : subscribe())} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-[#1E4D38] px-4 text-xs font-bold text-[#1E4D38] transition hover:bg-[#E6EFE8] disabled:opacity-60 sm:self-auto">{state === 'subscribed' ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}{busy ? 'Working…' : state === 'subscribed' ? 'Unsubscribe' : 'Get updates'}</button>}
      </div>
    </section>
  );
}
