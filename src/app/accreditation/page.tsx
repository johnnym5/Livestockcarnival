import AccreditationForm from '@/components/AccreditationForm';
import { Shield, FileText, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media & Press Accreditation | National Livestock Carnival 2026',
  description:
    'Official media crew intake and editorial badge registration for the National Livestock Carnival 2026 at Old Parade Ground, Abuja.',
};

export default function AccreditationPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-[#1E4D38] uppercase bg-[#D8EADF] px-3.5 py-1.5 rounded-full inline-block mb-3">
            Press & Broadcaster Operations
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] mb-4">
            Media Crew Accreditation
          </h1>
          <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto">
            Accredited media personnel receive unhindered access to the Media Center,
            press briefing suites, dedicated 1Gbps fiber backhaul, and arena photography positions.
          </p>
        </div>

        {/* Requirements info card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-card">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D8EADF] text-[#1E4D38] flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111827]">NIN Identity Check</h4>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Mandatory 11-digit national identity for security clearance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3D6] text-[#8D6B1B] flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111827]">PDF Intro Letter</h4>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Official assignment letter on editor letterhead (max 5MB).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D8EADF] text-[#1E4D38] flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111827]">48-Hour Processing</h4>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Digital barcodes issued via email for Old Parade Ground entry.
              </p>
            </div>
          </div>
        </div>

        {/* Accreditation Form Component */}
        <AccreditationForm />
      </div>
    </main>
  );
}
