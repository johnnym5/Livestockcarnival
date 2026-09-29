import LivestockGrid from '@/components/LivestockGrid';
import { Crown, Shield, Compass } from 'lucide-react';
import ThreeDCard from '@/components/motion/ThreeDCard';

export const metadata = {
  title: 'Golden Camel & Champion Livestock Catalog | Livestock Carnival',
  description:
    'Explore the official showcase of championship dromedaries, royal cavalry stallions, and certified cattle herds on livestockcarnival.ng.',
};

export default function LivestockPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111827] flex flex-col font-sans selection:bg-[#D8EADF] selection:text-[#1E4D38] pt-24 pb-20">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 3D Elevated Hero Banner in System Forest Green */}
        <ThreeDCard
          variant="glass"
          glowColor="rgba(30, 77, 56, 0.25)"
          maxTilt={6}
          depth={20}
          className="border-[#B8D8C5] shadow-card hover:shadow-card-hover"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1E4D38] via-[#163B2B] to-[#111827] text-white p-8 sm:p-12 space-y-6 [transform-style:preserve-3d]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 blur-3xl rounded-full pointer-events-none" />

            <div
              style={{ transform: 'translateZ(35px)' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D8EADF] border border-[#B8D8C5] text-[#1E4D38] text-xs font-extrabold uppercase tracking-widest shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-[#1E4D38]" />
              Golden Camel &amp; Livestock Registry
            </div>

            <div
              style={{ transform: 'translateZ(25px)' }}
              className="max-w-3xl space-y-4"
            >
              <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D8EADF] to-[#FEF3D6] tracking-tight leading-tight">
                Championship Herds &amp; Royal Cavalry
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Explore official verified records of premier dromedaries, royal Durbar steeds, and certified Zebu cattle from leading livestock breeders and Emirates across Nigeria.
              </p>
            </div>

            <div
              style={{ transform: 'translateZ(20px)' }}
              className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-[#D8EADF] border-t border-white/15"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#D4AF37]" /> Health &amp; Lineage Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#D4AF37]" /> Official National Registry
              </span>
            </div>
          </div>
        </ThreeDCard>

        {/* Dynamic Grid Section */}
        <section className="space-y-6">
          <LivestockGrid />
        </section>
      </div>
    </div>
  );
}
