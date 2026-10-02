'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CalendarClock, Megaphone, Send, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Campaign {
  id: string;
  title: string;
  body: string;
  url: string | null;
  scheduled_at: string | null;
  status: 'queued' | 'sending' | 'sent' | 'failed';
  sent_count: number;
  failed_count: number;
  created_at: string;
}

function lagosLocalToIso(value: string): string {
  const [date, time] = value.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour - 1, minute)).toISOString();
}

export default function PushCampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    const { data, error: invokeError } = await supabase.functions.invoke('push-notifications', { body: { action: 'list' } });
    if (invokeError) throw invokeError;
    setCampaigns(Array.isArray(data?.campaigns) ? data.campaigns as Campaign[] : []);
  };

  useEffect(() => {
    let active = true;
    void supabase.functions.invoke('push-notifications', { body: { action: 'list' } }).then(({ data, error: invokeError }) => {
      if (!active) return;
      if (invokeError) setError('Could not load push announcements. Check that the push-notifications function is deployed.');
      else setCampaigns(Array.isArray(data?.campaigns) ? data.campaigns as Campaign[] : []);
      setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(''); setMessage(''); setIsSending(true);
    try {
      const safeUrl = url.trim() ? new URL(url.trim(), window.location.origin) : null;
      if (safeUrl && (safeUrl.protocol !== 'https:' || safeUrl.origin !== window.location.origin)) {
        setError('The destination must be a secure link on this website.');
        return;
      }
      const scheduleIso = scheduledAt ? lagosLocalToIso(scheduledAt) : null;
      if (scheduleIso && new Date(scheduleIso).getTime() < Date.now() + 60_000) {
        setError('Choose a send time at least one minute from now (Africa/Lagos time).');
        return;
      }
      const { data, error: invokeError } = await supabase.functions.invoke('push-notifications', {
        body: { action: scheduleIso ? 'schedule' : 'send', title: title.trim(), message: body.trim(), url: safeUrl?.toString() ?? null, scheduled_at: scheduleIso },
      });
      if (invokeError) throw invokeError;
      setTitle(''); setBody(''); setUrl(''); setScheduledAt('');
      setMessage(scheduleIso ? 'Announcement scheduled.' : `Announcement sent to ${Number(data?.sent ?? 0)} subscribers.`);
      await refresh();
    } catch {
      setError('Could not save this announcement. Check the connection and try again.');
    } finally {
      setIsSending(false);
    }
  };

  const cancel = async (id: string) => {
    setError(''); setMessage('');
    const { error: invokeError } = await supabase.functions.invoke('push-notifications', { body: { action: 'cancel', id } });
    if (invokeError) { setError('Could not cancel the scheduled announcement.'); return; }
    setMessage('Scheduled announcement cancelled.');
    await refresh();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {(error || message) && <div role={error ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${error ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>{error || message}</div>}
      <section className="rounded-2xl border border-[#E1E7E0] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F9F0D7] text-[#8D6B1B]"><Megaphone className="h-5 w-5" /></span><div><h2 className="font-extrabold">New public announcement</h2><p className="mt-1 text-xs text-[#758078]">Sends to every active browser subscriber.</p></div></div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5"><span className="text-xs font-bold">Notification title</span><input required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} className="h-11 w-full rounded-xl border border-[#DDE4DC] px-3 text-sm outline-none focus:border-[#1E4D38]" placeholder="Official carnival update" /><span className="block text-right text-[10px] text-[#758078]">{title.length}/100</span></label>
          <label className="block space-y-1.5"><span className="text-xs font-bold">Message</span><textarea required maxLength={240} value={body} onChange={(event) => setBody(event.target.value)} rows={3} className="w-full resize-y rounded-xl border border-[#DDE4DC] px-3 py-2.5 text-sm outline-none focus:border-[#1E4D38]" placeholder="Write the announcement for subscribers" /><span className="block text-right text-[10px] text-[#758078]">{body.length}/240</span></label>
          <label className="block space-y-1.5"><span className="text-xs font-bold">Destination URL (optional)</span><input type="url" value={url} onChange={(event) => setUrl(event.target.value)} className="h-11 w-full rounded-xl border border-[#DDE4DC] px-3 text-sm outline-none focus:border-[#1E4D38]" placeholder="https://livestockcarnival.ng/schedule" /></label>
          <label className="block space-y-1.5"><span className="text-xs font-bold">Schedule for Africa/Lagos (leave blank to send now)</span><input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="h-11 w-full rounded-xl border border-[#DDE4DC] px-3 text-sm outline-none focus:border-[#1E4D38]" /><span className="block text-[10px] text-[#758078]">Times are interpreted as West Africa Time (UTC+1).</span></label>
          <button type="submit" disabled={isSending} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1E4D38] px-5 text-xs font-bold text-white disabled:opacity-60">{scheduledAt ? <CalendarClock className="h-4 w-4" /> : <Send className="h-4 w-4" />}{isSending ? 'Saving…' : scheduledAt ? 'Schedule announcement' : 'Send announcement'}</button>
        </form>
      </section>
      <section className="overflow-hidden rounded-2xl border border-[#E1E7E0] bg-white shadow-sm">
        <div className="border-b border-[#E9EDE8] p-5"><h2 className="font-extrabold">Recent announcements</h2><p className="mt-1 text-xs text-[#758078]">Scheduled messages can be cancelled before delivery.</p></div>
        {isLoading ? <p className="p-5 text-sm text-[#758078]">Loading announcements…</p> : campaigns.length ? <div className="divide-y divide-[#EEF1ED]">{campaigns.map((campaign) => <article key={campaign.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="min-w-0"><p className="truncate text-sm font-bold">{campaign.title}</p><p className="mt-1 line-clamp-2 text-xs text-[#68746C]">{campaign.body}</p><p className="mt-1 text-[10px] text-[#758078]">{campaign.status === 'queued' && campaign.scheduled_at ? `Scheduled ${new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos' }).format(new Date(campaign.scheduled_at))} WAT` : campaign.status === 'sent' ? `Sent to ${campaign.sent_count} · ${campaign.failed_count} failed` : campaign.status}</p></div>{campaign.status === 'queued' && <button type="button" onClick={() => void cancel(campaign.id)} className="inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-lg border border-rose-200 px-3 text-xs font-bold text-rose-700 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /> Cancel</button>}</article>)}</div> : <p className="p-8 text-center text-sm text-[#758078]">No announcements yet.</p>}
      </section>
    </div>
  );
}
