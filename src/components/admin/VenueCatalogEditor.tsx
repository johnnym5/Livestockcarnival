'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import { ImagePlus, MapPin, Plus, Save, Trash2 } from 'lucide-react';
import { CARNIVAL_PROGRAM, type DayProgram } from '@/data/carnivalProgram';
import { DEFAULT_EVENT_VENUES, DEFAULT_VENUES, type CarnivalVenue } from '@/data/venueCatalog';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContent';
import { supabase } from '@/lib/supabase/client';
import 'leaflet/dist/leaflet.css';

type Content = { days: Record<string, DayProgram>; venues: CarnivalVenue[]; eventVenues: Record<string, string[]> };
type JsonRecord = Record<string, unknown>;

function PointPicker({ active, onPick }: { active: boolean; onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(event) { if (active) onPick(event.latlng.lat, event.latlng.lng); } });
  return null;
}

function newVenue(lat = 9.0428, lng = 7.489): CarnivalVenue {
  return { id: `venue-${Date.now()}`, name: '', zone: '', description: '', latitude: lat, longitude: lng, image: '' };
}

export default function VenueCatalogEditor({ onChooseImage }: { onChooseImage: (setImage: (url: string) => void) => void }) {
  const [content, setContent] = useState<Content>({ days: CARNIVAL_PROGRAM, venues: DEFAULT_VENUES, eventVenues: DEFAULT_EVENT_VENUES });
  const [baseContent, setBaseContent] = useState<JsonRecord>(DEFAULT_SITE_CONTENT.schedule as JsonRecord);
  const [selectedId, setSelectedId] = useState(DEFAULT_VENUES[0]?.id ?? '');
  const [placing, setPlacing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const selected = content.venues.find((venue) => venue.id === selectedId) ?? null;
  const events = useMemo(() => Object.entries(content.days).flatMap(([dayKey, day]) => day.timeBlocks.map((event) => ({ dayKey, day, event }))), [content.days]);

  useEffect(() => {
    let active = true;
    void supabase.from('site_page_content').select('content').eq('page_key', 'schedule').maybeSingle().then(({ data }) => {
      if (!active || !data?.content || typeof data.content !== 'object') return;
      const saved = data.content as JsonRecord;
      setBaseContent(saved);
      const defaults = DEFAULT_SITE_CONTENT.schedule as unknown as Content;
      const next: Content = {
        days: (saved.days as Content['days']) || defaults.days,
        venues: (saved.venues as CarnivalVenue[]) || defaults.venues,
        eventVenues: (saved.eventVenues as Record<string, string[]>) || defaults.eventVenues,
      };
      setContent(next);
      setSelectedId(next.venues[0]?.id ?? '');
    });
    return () => { active = false; };
  }, []);

  const updateSelected = (patch: Partial<CarnivalVenue>) => {
    if (!selected) return;
    setContent((current) => ({ ...current, venues: current.venues.map((venue) => venue.id === selected.id ? { ...venue, ...patch } : venue) }));
  };
  const toggleEventVenue = (eventId: string, checked: boolean) => setContent((current) => {
    const ids = new Set(current.eventVenues[eventId] || []);
    if (checked && selected) ids.add(selected.id);
    else if (selected) ids.delete(selected.id);
    return { ...current, eventVenues: { ...current.eventVenues, [eventId]: [...ids] } };
  });
  const save = async () => {
    if (saving) return;
    if (content.venues.some((venue) => !venue.name.trim() || !venue.zone.trim())) { setMessage('Every venue needs a name and zone before publishing.'); return; }
    setSaving(true);
    const { error } = await supabase.from('site_page_content').upsert({ page_key: 'schedule', content: { ...baseContent, ...content }, status: 'published', updated_at: new Date().toISOString() });
    setMessage(error ? `Could not publish venues: ${error.message}` : 'Venue locations and schedule links published.');
    setSaving(false);
  };

  return <section className="overflow-hidden rounded-xl border border-[#E1E7E0] bg-white shadow-sm">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9EDE8] p-4 sm:p-5"><div><h2 className="text-base font-extrabold">Venue map &amp; schedule links</h2><p className="mt-1 text-xs text-[#68746C]">Place venue points, add a cover image, then link events to one or more venues.</p></div><button type="button" onClick={() => { const venue = newVenue(); setContent((current) => ({ ...current, venues: [...current.venues, venue] })); setSelectedId(venue.id); setPlacing(true); }} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1E4D38] px-3 text-xs font-bold text-white"><Plus className="h-4 w-4" />Add venue</button></header>
    {message && <p role="status" className="px-4 pt-3 text-xs font-semibold text-[#1E4D38]">{message}</p>}
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.85fr)]">
      <div className="relative h-[46vh] min-h-80 border-b border-[#E9EDE8] lg:h-[680px] lg:border-b-0 lg:border-r">
        <MapContainer center={[9.0428, 7.489]} zoom={17} className="h-full w-full">
          <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" attribution="&copy; Google Satellite Imagery" maxZoom={20} />
          <PointPicker active={placing} onPick={(latitude, longitude) => { updateSelected({ latitude, longitude }); setPlacing(false); }} />
          {content.venues.map((venue) => <CircleMarker key={venue.id} center={[venue.latitude, venue.longitude]} radius={venue.id === selectedId ? 12 : 8} pathOptions={{ fillColor: venue.id === selectedId ? '#D4AF37' : '#1E4D38', color: '#fff', weight: 2, fillOpacity: 0.95 }} eventHandlers={{ click: () => { setSelectedId(venue.id); setPlacing(false); } }} />)}
        </MapContainer>
        <div className="absolute left-3 top-3 z-[500] flex gap-2"><button type="button" disabled={!selected} onClick={() => setPlacing((value) => !value)} className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-bold shadow ${placing ? 'bg-[#D4AF37] text-[#111827]' : 'bg-white text-[#1E4D38]'}`}><MapPin className="h-4 w-4" />{placing ? 'Click map to place point' : 'Place point on map'}</button></div>
      </div>
      <div className="max-h-[680px] space-y-4 overflow-y-auto p-4 sm:p-5">
        <div className="flex gap-2 overflow-x-auto pb-1">{content.venues.map((venue) => <button key={venue.id} onClick={() => { setSelectedId(venue.id); setPlacing(false); }} className={`shrink-0 rounded-md border px-3 py-2 text-xs font-bold ${selectedId === venue.id ? 'border-[#1E4D38] bg-[#EAF2EA] text-[#1E4D38]' : 'border-[#DDE4DC] bg-white text-[#59635D]'}`}>{venue.name || 'New venue'}</button>)}</div>
        {selected ? <>
          <div className="grid gap-3 sm:grid-cols-2"><label className="text-[11px] font-bold text-[#526057]">Venue name<input value={selected.name} onChange={(event) => updateSelected({ name: event.target.value })} className="mt-1 h-9 w-full rounded border border-[#DDE4DC] px-2 text-xs font-normal" /></label><label className="text-[11px] font-bold text-[#526057]">Zone<input value={selected.zone} onChange={(event) => updateSelected({ zone: event.target.value })} className="mt-1 h-9 w-full rounded border border-[#DDE4DC] px-2 text-xs font-normal" /></label></div>
          <label className="block text-[11px] font-bold text-[#526057]">Description<textarea value={selected.description} onChange={(event) => updateSelected({ description: event.target.value })} rows={3} className="mt-1 w-full resize-y rounded border border-[#DDE4DC] p-2 text-xs font-normal" /></label>
          <div className="grid gap-3 sm:grid-cols-2"><label className="text-[11px] font-bold text-[#526057]">Latitude<input type="number" step="0.000001" value={selected.latitude} onChange={(event) => updateSelected({ latitude: Number(event.target.value) })} className="mt-1 h-9 w-full rounded border border-[#DDE4DC] px-2 text-xs font-normal" /></label><label className="text-[11px] font-bold text-[#526057]">Longitude<input type="number" step="0.000001" value={selected.longitude} onChange={(event) => updateSelected({ longitude: Number(event.target.value) })} className="mt-1 h-9 w-full rounded border border-[#DDE4DC] px-2 text-xs font-normal" /></label></div>
          <div><div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-bold text-[#526057]">Cover photo</span><button type="button" onClick={() => onChooseImage((image) => updateSelected({ image }))} className="inline-flex h-8 items-center gap-1.5 rounded bg-[#EAF2EA] px-2.5 text-[10px] font-bold text-[#1E4D38]"><ImagePlus className="h-3.5 w-3.5" />Choose image</button></div>{selected.image && <div className="relative h-32 overflow-hidden rounded bg-[#E9EEE8]"><Image src={selected.image} alt={`${selected.name} preview`} fill sizes="480px" className="object-cover" unoptimized /></div>}</div>
          <fieldset className="space-y-2 rounded-lg border border-[#E1E7E0] p-3"><legend className="px-1 text-xs font-extrabold text-[#1E4D38]">Scheduled events at this venue</legend><div className="max-h-52 space-y-2 overflow-y-auto">{events.map(({ day, event }) => <label key={event.id} className="flex items-start gap-2 text-xs"><input type="checkbox" checked={(content.eventVenues[event.id] || []).includes(selected.id)} onChange={(e) => toggleEventVenue(event.id, e.target.checked)} className="mt-0.5 accent-[#1E4D38]" /><span><strong>Day {day.dayNumber}: {event.heading}</strong><span className="mt-0.5 block text-[10px] text-[#68746C]">{event.timeRange}</span></span></label>)}</div></fieldset>
          <button type="button" onClick={() => { const next = content.venues.filter((venue) => venue.id !== selected.id); setContent((current) => ({ ...current, venues: next, eventVenues: Object.fromEntries(Object.entries(current.eventVenues).map(([id, venueIds]) => [id, venueIds.filter((item) => item !== selected.id)])) })); setSelectedId(next[0]?.id ?? ''); setPlacing(false); }} className="inline-flex h-9 items-center gap-2 rounded border border-rose-200 px-3 text-xs font-bold text-rose-700"><Trash2 className="h-4 w-4" />Remove venue</button>
        </> : <p className="py-10 text-center text-sm text-[#68746C]">Add a venue to begin.</p>}
      </div>
    </div>
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E9EDE8] bg-[#FBFCFA] px-4 py-3 sm:px-5"><span className="text-[11px] text-[#68746C]">Changes publish with the schedule page content.</span><button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1E4D38] px-3 text-xs font-extrabold text-white disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Publishing…' : 'Publish venues'}</button></footer>
  </section>;
}
