import AccreditationForm from '@/components/AccreditationForm';
import { Shield, FileText, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'Media & Press Accreditation | National Livestock Carnival 2026',
  description:
    'Official media crew intake and editorial badge registration for the National Livestock Carnival 2026 at Old Parade Ground, Abuja.',
};

export default function AccreditationPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] pt-24 pb-20 overflow-x-hidden">
      {/* Ambient light */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#D8EADF]/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal direction="zoom" delay={0}>
            <span className="text-xs font-bold tracking-widest text-[#1E4D38] uppercase bg-[#D8EADF] px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 bg-[#1E4D38] rounded-full" />
              Press &amp; Broadcaster Operations
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.08} duration={1.1}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] mb-4 tracking-tight">
              Media Crew Accreditation
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.16} duration={1.0}>
            <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
              Accredited media personnel receive unhindered access to the Media Center,
              press briefing suites, dedicated 1Gbps fiber backhaul, and arena photography positions.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <div className="w-16 h-0.5 bg-[#E4B03A] mx-auto mt-6" />
          </ScrollReveal>
        </div>

        {/* Requirements info card */}
        <ScrollReveal direction="up" delay={0.1} duration={0.9}>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-card">
            {[
              {
                icon: Shield,
                bg: 'bg-[#D8EADF]',
                color: 'text-[#1E4D38]',
                title: 'NIN Identity Check',
                desc: 'Mandatory 11-digit national identity for security clearance.',
              },
              {
                icon: FileText,
                bg: 'bg-[#FEF3D6]',
                color: 'text-[#8D6B1B]',
                title: 'PDF Intro Letter',
                desc: 'Official assignment letter on editor letterhead (max 5MB).',
              },
              {
                icon: CheckCircle2,
                bg: 'bg-[#D8EADF]',
                color: 'text-[#1E4D38]',
                title: '48-Hour Processing',
                desc: 'Digital barcodes issued via email for Old Parade Ground entry.',
              },
            ].map((req, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-2xl ${req.bg} ${req.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  <req.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827]">{req.title}</h4>
                  <p className="text-xs text-[#4B5563] mt-0.5">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Accreditation Form Component */}
        <ScrollReveal direction="up" delay={0.15} duration={0.9}>
          <AccreditationForm />
        </ScrollReveal>
      </div>
    </main>
  );
}
