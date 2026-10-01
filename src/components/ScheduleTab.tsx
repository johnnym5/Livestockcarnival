'use client';

import { useState, useMemo, useEffect } from 'react';
import { MapPin, Calendar, Filter, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CARNIVAL_PROGRAM, DayProgram, TimeBlock } from '@/data/carnivalProgram';
import { generateICS } from '@/lib/ics';
import { supabase } from '@/lib/supabase/client';

export default function ScheduleTab() {
  const [scheduleDays, setScheduleDays] = useState<Record<string, DayProgram>>(CARNIVAL_PROGRAM);
  const [selectedDayKey, setSelectedDayKey] = useState<string>('day1');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');

  useEffect(() => {
    let active = true;
    void supabase.from('site_page_content').select('content').eq('page_key', 'schedule').eq('status', 'published').maybeSingle().then(({ data }) => {
      if (!active || !data?.content || typeof data.content !== 'object') return;
      const days = (data.content as { days?: Record<string, DayProgram> }).days;
      if (days && Object.keys(days).length) {
        setScheduleDays(days);
        setSelectedDayKey(Object.keys(days)[0]);
      }
    });
    return () => { active = false; };
  }, []);

  const dayTabs = Object.entries(scheduleDays).map(([key, day]) => ({ key, shortLabel: `Day ${day.dayNumber} — ${day.dateString}`, subTitle: day.title }));
  const trackFilters = useMemo(() => {
    const tracks = Array.from(new Set(Object.values(scheduleDays).flatMap((day) => day.timeBlocks.map((block) => block.track))));
    return [{ id: 'all', label: 'All Events', trackMatch: 'All' }, ...tracks.map((track) => ({ id: track.toLowerCase(), label: `${track} Events`, trackMatch: track }))];
  }, [scheduleDays]);
  const currentDayProgram: DayProgram = scheduleDays[selectedDayKey] || Object.values(scheduleDays)[0] || CARNIVAL_PROGRAM.day1;

  const filteredTimeBlocks = useMemo(() => {
    if (selectedTrack === 'All') {
      return currentDayProgram.timeBlocks;
    }
    return currentDayProgram.timeBlocks.filter(
      (block) => block.track.toLowerCase() === selectedTrack.toLowerCase()
    );
  }, [currentDayProgram, selectedTrack]);

  return (
    <div className="w-full">
      {/* Sticky 3-Day Tabs Bar */}
      <div className="sticky top-20 z-30 bg-[#FBFBFA]/90 backdrop-blur-md py-4 mb-8 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-4xl mx-auto">
          {dayTabs.map((tab) => {
            const isSelected = selectedDayKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setSelectedDayKey(tab.key);
                  setSelectedTrack('All');
                }}
                className={`flex-1 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex flex-col items-center justify-center text-center relative ${
                  isSelected
                    ? 'bg-[#1E4D38] text-white shadow-card-hover scale-[1.02]'
                    : 'bg-white border border-slate-200 text-[#4B5563] shadow-sm hover:border-[#B8D8C5] hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E4B03A]' : 'text-[#1E4D38]'}`} />
                  <span className="font-extrabold">{tab.shortLabel}</span>
                </div>
                <span className={`text-[10px] normal-case font-normal line-clamp-1 ${isSelected ? 'text-[#D8EADF]' : 'text-[#6B7280]'}`}>
                  {tab.subTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Header Summary */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`day-header-${selectedDayKey}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-card"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0F4A2F] bg-[#D8EADF] px-3.5 py-1.5 rounded-xl inline-block">
                {currentDayProgram.dateString}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-3 tracking-tight">
                {currentDayProgram.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4B5563] bg-[#FBFBFA] px-4 py-2.5 rounded-xl border border-slate-200/80 shrink-0">
              <Clock className="w-4 h-4 text-[#8D6B1B]" />
              <span>Day {currentDayProgram.dayNumber} Official Itinerary</span>
            </div>
          </div>

          {/* Secondary Track Filter Button Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#4B5563] flex items-center gap-1.5 mr-2 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" /> Filter Track:
            </span>
            {trackFilters.map((tf) => {
              const isActive = selectedTrack === tf.trackMatch;
              return (
                <button
                  key={tf.id}
                  onClick={() => setSelectedTrack(tf.trackMatch)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#D8EADF] text-[#0F4A2F] font-bold border border-[#B8D8C5] shadow-sm'
                      : 'bg-[#FBFBFA] text-[#4B5563] border border-slate-200 hover:bg-slate-100 hover:text-[#111827]'
                  }`}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Time Blocks List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`blocks-${selectedDayKey}-${selectedTrack}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {filteredTimeBlocks.map((block: TimeBlock, index: number) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 28, rotateX: 3, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.99 }}
              transition={{ duration: 0.75, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="[transform-style:preserve-3d]"
            >
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-card transition-all duration-700">
              {/* Top Row: Time Badge & Track Tag */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="bg-[#D8EADF] text-[#0F4A2F] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide inline-flex items-center gap-2 shadow-sm">
                  <Clock className="w-4 h-4 shrink-0 text-[#0F4A2F]" />
                  {block.timeRange}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl bg-[#FEF3D6] text-[#8D6B1B] border border-[#FCE6A8]">
                  {block.track} Track
                </span>
              </div>

              {/* Event Title */}
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] mb-2 tracking-tight">
                {block.heading}
              </h3>

              {/* Location Row */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E4D38] mb-4">
                <MapPin className="w-4 h-4 text-[#1E4D38] shrink-0" />
                <span>{block.location}</span>
              </div>

              {/* Details Paragraph */}
              <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
                {block.details}
              </p>

              {/* Activities Sub-List */}
              {block.activities && block.activities.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E4D38]" /> Key Highlights & Ground Activities
                  </h4>
                  <ul className="space-y-2.5">
                    {block.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#374151] leading-snug">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1E4D38] shrink-0 mt-1.5" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Save to Calendar Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() =>
                    generateICS({
                      id: block.id,
                      title: block.heading,
                      venue: block.location,
                      description: `${block.details}\n\nKey Highlights:\n${block.activities.map((a) => `- ${a}`).join('\n')}`,
                      startIso: `2026-11-2${currentDayProgram.dayNumber}T09:00:00+01:00`,
                      endIso: `2026-11-2${currentDayProgram.dayNumber}T12:00:00+01:00`,
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FBFBFA] border border-slate-200 hover:border-[#B8D8C5] hover:bg-[#D8EADF]/30 text-[#1E4D38] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Save to Calendar</span>
                </button>
              </div>
              </div>
            </motion.div>
          ))}

          {filteredTimeBlocks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 text-[#4B5563] shadow-card">
              No events found matching the selected track for this day.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
