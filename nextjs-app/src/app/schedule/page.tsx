import scheduleData from '@/data/schedule.json';
import ScheduleTab from '@/components/ScheduleTab';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Festival Schedule & Timetable | National Livestock Carnival 2026',
  description:
    'Complete 3-day program schedule for the 2026 Renewed Hope National Livestock Carnival in Abuja. Filter sessions by track - equestrian, trade, culinary, and ceremonial - and sync calendar reminders via .ics.',
};

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] pt-24 pb-20">
      {/* Header Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <span className="text-xs font-bold tracking-widest text-[#1E4D38] uppercase bg-[#D8EADF] px-3.5 py-1.5 rounded-full inline-block mb-3">
          Official Timetable
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] mb-4">
          3-Day Interactive Festival Program
        </h1>
        <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto">
          November 21 – 23, 2026 • Old Parade Ground, Area 10, Garki, Abuja.
          Explore ceremonial sessions, livestock breed judging, B2B trade
          dialogues, and night culinary showcases.
        </p>
      </section>

      {/* Interactive Schedule Tab */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScheduleTab days={scheduleData} />
      </section>

      {/* External Registration CTA Strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#1E4D38] to-[#111827] text-white p-8 sm:p-12 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-2xl font-bold mb-2">Claim Free Public Gate Pass</h3>
            <p className="text-sm text-gray-200">
              Access all ceremonial tracks, livestock judging courts, and culinary pavilions free of charge.
            </p>
          </div>
          <a
            href="https://gcc-carnival.web.app/ticket"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#FEF3D6] text-[#8D6B1B] hover:bg-[#FCE6A8] text-sm font-bold uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            Claim Gate Pass
          </a>
        </div>
      </section>
    </main>
  );
}
