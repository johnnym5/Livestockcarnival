import scheduleData from '@/data/schedule.json';
import ScheduleTab from '@/components/ScheduleTab';
import ScrollReveal from '@/components/ScrollReveal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Festival Schedule & Timetable | National Livestock Carnival 2026',
  description:
    'Complete 3-day program schedule for the 2026 Renewed Hope National Livestock Carnival in Abuja. Filter sessions by track - equestrian, trade, culinary, and ceremonial - and sync calendar reminders via .ics.',
};

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] pt-24 pb-20 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#D8EADF]/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Banner */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <ScrollReveal direction="zoom" delay={0}>
          <span className="text-xs font-bold tracking-widest text-[#1E4D38] uppercase bg-[#D8EADF] px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-[#1E4D38] rounded-full" />
            Official Timetable
          </span>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.08} duration={1.1}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] mb-4 tracking-tight">
            3-Day Interactive Festival Program
          </h1>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.16} duration={1.0}>
          <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            November 21 – 23, 2026 &bull; Old Parade Ground, Area 10, Garki, Abuja.
            Explore ceremonial sessions, livestock breed judging, B2B trade
            dialogues, and night culinary showcases.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <div className="w-16 h-0.5 bg-[#E4B03A] mx-auto mt-6" />
        </ScrollReveal>
      </section>

      {/* Interactive Schedule Tab */}
      <ScrollReveal direction="up" delay={0.1} duration={0.85}>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScheduleTab days={scheduleData} />
        </section>
      </ScrollReveal>

      {/* External Registration CTA Strip */}
      <ScrollReveal direction="up" delay={0.05} duration={0.9}>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="relative bg-gradient-to-r from-[#0F4A2F] via-[#1E4D38] to-[#111827] text-white p-8 sm:p-12 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
            <div className="relative">
              <h3 className="text-2xl font-bold mb-2">Claim Free Public Gate Pass</h3>
              <p className="text-sm text-[#D8EADF] leading-relaxed">
                Access all ceremonial tracks, livestock judging courts, and culinary pavilions free of charge.
              </p>
            </div>
            <a
              href="https://pass.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-8 py-4 bg-[#E4B03A] hover:bg-[#D4A030] text-[#111827] text-sm font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-button hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
            >
              Claim Gate Pass
            </a>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
