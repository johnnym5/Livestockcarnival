import ScheduleTab from '@/components/ScheduleTab';
import ScrollReveal from '@/components/ScrollReveal';
import EditablePageIntro from '@/components/EditablePageIntro';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official 3-Day Carnival Program | National Livestock Carnival 2026',
  description:
    'Complete 3-day program schedule for the 2026 Renewed Hope National Livestock Carnival in Abuja. Filter sessions by track - ceremonies, livestock judging, agribusiness B2B, and live concert entertainments.',
};

export default function SchedulePage() {
  return (
    <main className="relative isolate min-h-screen bg-[#FBFBFA] pt-24 pb-20 overflow-x-clip">
      {/* Ambient glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[min(700px,100vw)] h-[300px] bg-[#D8EADF]/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Banner */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <EditablePageIntro page="schedule" />
        <ScrollReveal direction="up" delay={0.1}>
          <div className="w-16 h-0.5 bg-[#E4B03A] mx-auto mt-6" />
        </ScrollReveal>
      </section>

      {/* Interactive Schedule Tab */}
      <ScrollReveal direction="up" delay={0.1} duration={0.85}>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScheduleTab />
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
