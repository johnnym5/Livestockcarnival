'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Clock3, MapPin, Navigation, CalendarPlus, Map, List } from 'lucide-react';
import { CARNIVAL_PROGRAM, type DayProgram, type TimeBlock } from '@/data/carnivalProgram';
import { DEFAULT_EVENT_VENUES, DEFAULT_VENUES, type CarnivalVenue, venueColor } from '@/data/venueCatalog';
import { generateICS } from '@/lib/ics';
import { supabase } from '@/lib/supabase/client';
import 'leaflet/dist/leaflet.css';

type ScheduleContent = { days?: Record<string, DayProgram>; venues?: CarnivalVenue[]; eventVenues?: Record<string, string[]> };
type MobileView = 'schedule' | 'map';

function normalizeVenues(value: unknown): CarnivalVenue[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): CarnivalVenue[] => {
    if (!item || typeof item !== 'object') return [];
    const venue = item as Partial<Record<keyof CarnivalVenue, unknown>>;
    const latitude = typeof venue.latitude === 'number' ? venue.latitude : Number(venue.latitude);
    const longitude = typeof venue.longitude === 'number' ? venue.longitude : Number(venue.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)
      || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return [];
    if (typeof venue.id !== 'string' || typeof venue.name !== 'string') return [];
    return [{
      id: venue.id,
      name: venue.name,
      zone: typeof venue.zone === 'string' ? venue.zone : '',
      description: typeof venue.description === 'string' ? venue.description : '',
      latitude,
      longitude,
      image: typeof venue.image === 'string' ? venue.image : '',
    }];
  });
}

function normalizeEventVenues(value: unknown): Record<string, string[]> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return Object.fromEntries(Object.entries(value).flatMap(([eventId, venueIds]) =>
    Array.isArray(venueIds)
      ? [[eventId, venueIds.filter((id): id is string => typeof id === 'string')]]
      : [],
  ));
}

function FlyToSelection({ venue }: { venue: CarnivalVenue | null }) {
  const map = useMap();
  useEffect(() => {
    if (venue && isValidVenueCoordinates(venue)) {
      map.flyTo([venue.latitude, venue.longitude], 18, { duration: 0.8 });
    }
  }, [map, venue]);
  return null;
}

function isValidVenueCoordinates(venue: CarnivalVenue): boolean {
  return Number.isFinite(venue.latitude)
    && Number.isFinite(venue.longitude)
    && venue.latitude >= -90
    && venue.latitude <= 90
    && venue.longitude >= -180
    && venue.longitude <= 180;
}

function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export default function ScheduleVenueExperience({ initialView = 'schedule' }: { initialView?: MobileView }) {
  const [days, setDays] = useState<Record<string, DayProgram>>(CARNIVAL_PROGRAM);
  const [venues, setVenues] = useState<CarnivalVenue[]>(DEFAULT_VENUES);
  const [eventVenues, setEventVenues] = useState<Record<string, string[]>>(DEFAULT_EVENT_VENUES);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [track, setTrack] = useState('All');
  const [mobileView, setMobileView] = useState<MobileView>(initialView);
  const [urlState, setUrlState] = useState<{ day: string | null; event: string | null }>({ day: null, event: null });

  useEffect(() => {
    let active = true;
    void supabase.from('site_page_content').select('content').eq('page_key', 'schedule').eq('status', 'published').maybeSingle().then(({ data }) => {
      if (!active || !data?.content || typeof data.content !== 'object') return;
      const content = data.content as ScheduleContent;
      if (content.days && Object.keys(content.days).length) setDays(content.days);
      const normalizedVenues = normalizeVenues(content.venues);
      const normalizedEventVenues = normalizeEventVenues(content.eventVenues);
      if (normalizedVenues.length) setVenues(normalizedVenues);
      if (normalizedEventVenues) setEventVenues(normalizedEventVenues);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const readUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setUrlState({ day: params.get('day'), event: params.get('event') });
      setSelectedVenueId(null);
    };
    readUrl();
    window.addEventListener('popstate', readUrl);
    return () => window.removeEventListener('popstate', readUrl);
  }, []);

  const eventEntries = useMemo(() => Object.entries(days).flatMap(([key, day]) => day.timeBlocks.map((event) => ({ dayKey: key, day, event }))), [days]);
  const validVenues = useMemo(() => venues.filter(isValidVenueCoordinates), [venues]);
  const dayKey = urlState.day && days[urlState.day] ? urlState.day : Object.keys(days)[0] || 'day1';
  const selectedEventId = eventEntries.some(({ event, dayKey: eventDay }) => event.id === urlState.event && eventDay === dayKey) ? urlState.event : null;
  const currentDay = days[dayKey] || Object.values(days)[0] || CARNIVAL_PROGRAM.day1;
  const dayEvents = currentDay.timeBlocks;
  const tracks = ['All', ...Array.from(new Set(dayEvents.map((event) => event.track)))];
  const visibleEvents = dayEvents.filter((event) => (track === 'All' || event.track === track) && (!selectedVenueId || (eventVenues[event.id] || []).includes(selectedVenueId)));
  const selectedVenue = validVenues.find((venue) => venue.id === selectedVenueId) ?? (selectedEventId ? validVenues.find((venue) => (eventVenues[selectedEventId] || []).includes(venue.id)) ?? null : null);
  const selectedEventVenues = selectedEventId ? validVenues.filter((venue) => (eventVenues[selectedEventId] || []).includes(venue.id)) : [];

  const updateUrl = useCallback((nextDay: string, eventId: string | null) => {
    const url = new URL(window.location.href);
    url.searchParams.set('day', nextDay);
    if (eventId) url.searchParams.set('event', eventId);
    else url.searchParams.delete('event');
    window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    setUrlState({ day: nextDay, event: eventId });
  }, []);

  const chooseDay = (nextDay: string) => {
    setSelectedVenueId(null);
    setTrack('All');
    updateUrl(nextDay, null);
  };
  const chooseEvent = (event: TimeBlock) => {
    setSelectedVenueId(null);
    const nextDay = Object.entries(days).find(([, day]) => day.timeBlocks.some((item) => item.id === event.id))?.[0] || dayKey;
    updateUrl(nextDay, event.id);
    setMobileView('map');
  };
  const chooseVenue = (venue: CarnivalVenue) => {
    setSelectedVenueId(venue.id);
    const linked = eventEntries.find(({ event }) => (eventVenues[event.id] || []).includes(venue.id));
    if (linked) {
      updateUrl(linked.dayKey, linked.event.id);
      setTrack('All');
    } else {
      updateUrl(dayKey, null);
    }
  };

  const calendar = (event: TimeBlock) => {
    const day = eventEntries.find((entry) => entry.event.id === event.id)?.day ?? currentDay;
    const date = new Date(2026, 10, 20 + day.dayNumber);
    const startIso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T09:00:00+01:00`;
    const endIso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T12:00:00+01:00`;
    generateICS({ id: event.id, title: event.heading, venue: (eventVenues[event.id] || []).map((id) => venues.find((venue) => venue.id === id)?.name).filter(Boolean).join(', ') || event.location, description: event.details, startIso, endIso });
  };

  return (
    <div className="min-h-[calc(100dvh-76px)] bg-[#F7F8F5] px-3 pb-6 pt-24 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8D6B1B]">Official Carnival Guide</p><h1 className="mt-1 text-2xl font-black tracking-tight text-[#111827] sm:text-3xl">Schedule &amp; Venue Map</h1><p className="mt-1 text-sm text-[#59635D]">Choose a day or event to see where the celebration happens.</p></div>
          <div className="inline-flex rounded-lg border border-[#D9E1D9] bg-white p-1 lg:hidden" role="tablist" aria-label="Choose schedule or map">
            {(['schedule', 'map'] as const).map((view) => <button key={view} role="tab" aria-selected={mobileView === view} onClick={() => setMobileView(view)} className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs font-bold capitalize ${mobileView === view ? 'bg-[#1E4D38] text-white' : 'text-[#536057]'}`}>{view === 'schedule' ? <List className="h-4 w-4" /> : <Map className="h-4 w-4" />}{view}</button>)}
          </div>
        </header>
        <section className="grid min-h-[calc(100dvh-190px)] gap-4 lg:grid-cols-[minmax(370px,0.92fr)_minmax(0,1.35fr)]">
          <div className={`${mobileView === 'schedule' ? 'flex' : 'hidden'} min-h-[65dvh] flex-col overflow-hidden rounded-lg border border-[#DCE3DC] bg-white lg:flex lg:min-h-0`}>
            <div className="border-b border-[#E5EAE5] p-3 sm:p-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">{Object.entries(days).map(([key, day]) => <button key={key} onClick={() => chooseDay(key)} className={`shrink-0 rounded-md px-3 py-2 text-xs font-bold ${dayKey === key ? 'bg-[#1E4D38] text-white' : 'border border-[#DCE3DC] text-[#46534A]'}`}>Day {day.dayNumber}<span className="ml-1.5 font-medium opacity-75">{day.dateString.split(',')[1]?.trim()}</span></button>)}</div>
              <div className="flex items-center justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-sm font-extrabold text-[#111827]">{currentDay.title}</h2><p className="mt-1 text-[11px] text-[#68746C]">{currentDay.dateString}</p></div><select aria-label="Filter schedule by track" value={track} onChange={(event) => setTrack(event.target.value)} className="h-9 max-w-36 rounded-md border border-[#DCE3DC] bg-white px-2 text-xs font-semibold text-[#354139]">{tracks.map((item) => <option key={item}>{item}</option>)}</select></div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3 sm:p-4">
              {visibleEvents.map((event) => {
                const linkedVenues = venues.filter((venue) => (eventVenues[event.id] || []).includes(venue.id));
                const active = selectedEventId === event.id;
                return <article key={event.id} className={`overflow-hidden rounded-md border transition ${active ? 'border-[#1E4D38] bg-[#F1F7F1] shadow-sm' : 'border-[#E3E8E3] bg-white hover:border-[#AFC8B7]'}`}>
                  <button onClick={() => chooseEvent(event)} className="w-full p-3 text-left sm:p-4" aria-pressed={active}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1E4D38]"><Clock3 className="h-3.5 w-3.5" />{event.timeRange}</span><span className="rounded bg-[#F8F0DB] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#80621A]">{event.track}</span></div>
                    <h3 className="text-sm font-extrabold leading-snug text-[#111827]">{event.heading}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#59635D]">{event.details}</p>
                    <div className="mt-3 flex items-start gap-1.5 text-[11px] text-[#315C43]"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{linkedVenues.length ? linkedVenues.map((venue) => venue.name).join(' · ') : event.location}</span></div>
                    {!linkedVenues.length && <p className="mt-2 rounded bg-[#FFF7E6] px-2 py-1.5 text-[10px] font-semibold text-[#84621B]">Venue pin not available yet. Showing the schedule location as provided.</p>}
                  </button>
                  {active && <div className="flex justify-end border-t border-[#DCE7DC] px-3 py-2"><button onClick={() => calendar(event)} className="inline-flex h-8 items-center gap-1.5 rounded border border-[#DCE3DC] bg-white px-2.5 text-[10px] font-bold text-[#315C43]"><CalendarPlus className="h-3.5 w-3.5" />Add to calendar</button></div>}
                </article>;
              })}
              {!visibleEvents.length && <p className="rounded-md bg-[#F7F8F5] p-5 text-center text-xs text-[#68746C]">No events match this selection.</p>}
            </div>
          </div>

          <div className={`${mobileView === 'map' ? 'flex' : 'hidden'} min-h-[65dvh] flex-col overflow-hidden rounded-lg border border-[#DCE3DC] bg-white lg:flex lg:min-h-0`}>
            <div className="relative min-h-[48dvh] flex-1 lg:min-h-0">
              <MapContainer center={[9.0428, 7.489]} zoom={17} className="absolute inset-0 h-full w-full" zoomControl scrollWheelZoom>
                <InvalidateMapSize />
                <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" attribution="&copy; Google Satellite Imagery" maxZoom={20} />
                <FlyToSelection venue={selectedVenue} />
                {validVenues.map((venue, index) => {
                  const active = selectedVenueId === venue.id || selectedEventVenues.some((item) => item.id === venue.id);
                  const color = venueColor(index);
                  const icon = divIcon({
                    className: 'venue-number-marker',
                    html: `<span style="width:${active ? 36 : 30}px;height:${active ? 36 : 30}px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 8px #0008;color:white;display:flex;align-items:center;justify-content:center;font:800 12px/1 Arial,sans-serif">${index + 1}</span>`,
                    iconSize: [active ? 36 : 30, active ? 36 : 30],
                    iconAnchor: [active ? 18 : 15, active ? 18 : 15],
                  });
                  return <Marker key={venue.id} position={[venue.latitude, venue.longitude]} icon={icon} title={`${index + 1}. ${venue.name}`} eventHandlers={{ click: () => chooseVenue(venue) }}>
                    <Tooltip direction="top" offset={[0, -12]}>{`${index + 1}. ${venue.name}`}</Tooltip>
                    <Popup><button className="w-56 text-left" onClick={() => chooseVenue(venue)}><strong className="text-sm text-[#173D2E]">{venue.name}</strong><span className="mt-1 block text-xs text-slate-600">{venue.zone}</span><span className="mt-2 block text-[11px] font-bold text-[#1E4D38]">View venue and related events</span></button></Popup>
                  </Marker>;
                })}
              </MapContainer>
            </div>
            {selectedVenue ? <aside className="grid shrink-0 grid-cols-[112px_1fr] gap-3 border-t border-[#E3E8E3] bg-white p-3 sm:grid-cols-[150px_1fr] sm:p-4">
              <div className="relative min-h-24 overflow-hidden rounded bg-[#E9EEE8]">{selectedVenue.image && <Image src={selectedVenue.image} alt={selectedVenue.name} fill sizes="150px" className="object-cover" />}</div>
              <div className="min-w-0"><p className="text-[9px] font-extrabold uppercase tracking-widest text-[#8D6B1B]">{selectedVenue.zone}</p><h2 className="mt-1 text-sm font-extrabold text-[#111827]">{selectedVenue.name}</h2><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5E685F]">{selectedVenue.description}</p><p className="mt-1 text-[10px] text-[#68746C]">{selectedVenue.latitude.toFixed(5)}, {selectedVenue.longitude.toFixed(5)}</p></div>
            </aside> : <div className="flex shrink-0 items-center gap-2 border-t border-[#E3E8E3] bg-white px-4 py-3 text-xs text-[#68746C]"><Navigation className="h-4 w-4 text-[#1E4D38]" />Select a venue pin to see its photo and scheduled events.</div>}
            {selectedVenueId && <div className="max-h-36 shrink-0 overflow-y-auto border-t border-[#E3E8E3] bg-[#F7F8F5] px-3 py-2">{eventEntries.filter(({ event }) => (eventVenues[event.id] || []).includes(selectedVenueId)).map(({ day, event, dayKey: eventDay }) => <button key={event.id} onClick={() => { setMobileView('schedule'); updateUrl(eventDay, event.id); }} className="flex w-full items-center justify-between gap-3 border-b border-[#E4E9E4] py-2 text-left last:border-0"><span className="min-w-0 truncate text-xs font-semibold text-[#25342A]">{event.heading}</span><span className="shrink-0 text-[10px] text-[#68746C]">Day {day.dayNumber} · {event.timeRange}</span></button>)}</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
