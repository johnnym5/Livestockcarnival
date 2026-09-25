'use client';

import { useState, useMemo } from 'react';
import { MapPin, User, Download, Calendar, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateICS } from '@/lib/ics';
import { staggerParent, staggerChildItem, fadeInScale, softSpring } from '@/lib/motion';

interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  venue: string;
  track: string;
  description: string;
  speaker?: string;
  startIso: string;
  endIso: string;
}

interface ScheduleDay {
  day: number;
  date: string;
  dayTitle: string;
  summary: string;
  events: ScheduleEvent[];
}

interface ScheduleTabProps {
  days: ScheduleDay[];
}

export default function ScheduleTab({ days }: ScheduleTabProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<string>('All');

  const currentDay = days[selectedDayIndex] || days[0];

  const tracks = useMemo(() => {
    if (!currentDay) return ['All'];
    const trackSet = new Set<string>();
    currentDay.events.forEach((e) => trackSet.add(e.track));
    return ['All', ...Array.from(trackSet)];
  }, [currentDay]);

  const filteredEvents = useMemo(() => {
    if (!currentDay) return [];
    if (selectedTrack === 'All') return currentDay.events;
    return currentDay.events.filter((e) => e.track === selectedTrack);
  }, [currentDay, selectedTrack]);

  return (
    <div className="w-full">
      {/* 3-Day Switcher Tabs */}
      <div className="flex flex-wrap justify-center gap-3.5 mb-10">
        {days.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          const formattedDate = new Date(day.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <button
              key={day.day || idx}
              onClick={() => {
                setSelectedDayIndex(idx);
                setSelectedTrack('All');
              }}
              className={`px-7 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 relative ${
                isSelected
                  ? 'bg-[#1E4D38] text-white shadow-card-hover -translate-y-0.5'
                  : 'bg-white border border-slate-200/80 text-[#4B5563] shadow-card hover:shadow-card-hover hover:border-[#B8D8C5] hover:text-[#111827]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>
                Day {day.day} · {formattedDate}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Overview Banner with AnimatePresence */}
      <AnimatePresence mode="wait">
        {currentDay && (
          <motion.div
            key={`day-banner-${selectedDayIndex}`}
            variants={fadeInScale}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-card"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8D6B1B] bg-[#FEF3D6] px-3.5 py-1.5 rounded-xl inline-block shadow-sm">
                  21 – 23 November 2026
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-3">
                  {currentDay.dayTitle}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[#4B5563] max-w-xl leading-relaxed">
                {currentDay.summary}
              </p>
            </div>

            {/* Track Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#4B5563] flex items-center gap-1.5 mr-2 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" /> Filter Track:
              </span>
              {tracks.map((track) => (
                <button
                  key={track}
                  onClick={() => setSelectedTrack(track)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all ${
                    selectedTrack === track
                      ? 'bg-[#D8EADF] text-[#1E4D38] font-bold border border-[#B8D8C5] shadow-sm'
                      : 'bg-[#FBFBFA] text-[#4B5563] border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List with Staggered AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`events-${selectedDayIndex}-${selectedTrack}`}
          variants={staggerParent}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-5"
        >
          {filteredEvents.map((event) => {
            const isGold =
              event.track.includes('Culinary') ||
              event.track.includes('Ceremonial');

            return (
              <motion.div
                key={event.id}
                variants={staggerChildItem}
                layout
                className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 items-start justify-between"
              >
                {/* Time & Track */}
                <div className="md:w-56 shrink-0 flex flex-col gap-2.5">
                  <div className="inline-block bg-[#FBFBFA] border border-[#E5E7EB] px-4 py-2 rounded-xl text-xs font-extrabold text-[#111827] shadow-sm">
                    {event.time}
                  </div>
                  <span
                    className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl w-fit shadow-sm ${
                      isGold
                        ? 'bg-[#FEF3D6] text-[#8D6B1B]'
                        : 'bg-[#D8EADF] text-[#1E4D38]'
                    }`}
                  >
                    {event.track}
                  </span>
                </div>

                {/* Title & Details */}
                <div className="flex-1 space-y-2.5">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-3 text-xs text-[#4B5563]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1E4D38]" />
                      <span className="font-medium">{event.venue}</span>
                    </div>
                    {event.speaker && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#8D6B1B]" />
                        <span className="font-medium">{event.speaker}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add to Calendar (.ics exporter) */}
                <div className="shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => generateICS(event)}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FBFBFA] border border-[#B8D8C5] hover:bg-[#D8EADF] text-[#1E4D38] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Sync .ICS</span>
                  </button>
                </div>
              </motion.div>
            );
          })}

          {filteredEvents.length === 0 && (
            <motion.div
              variants={staggerChildItem}
              className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 text-[#4B5563] shadow-card"
            >
              No sessions match the selected track filter for this day.
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
