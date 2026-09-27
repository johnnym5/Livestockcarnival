import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LivestockGrid from '@/components/LivestockGrid';
import { Sparkles, Shield, Compass } from 'lucide-react';

export const metadata = {
  title: 'Golden Camel & Champion Livestock Catalog | Livestock Carnival',
  description:
    'Explore the official showcase of championship dromedaries, royal cavalry stallions, and certified cattle herds on livestockcarnival.ng.',
};

export default function LivestockPage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Golden Camel & Livestock Registry
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 tracking-tight leading-tight">
              Championship Herds & Royal Cavalry
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore live verified records of premier dromedaries, royal Durbar steeds, and certified Zebu cattle. Data and media assets are dynamically delivered via Supabase PostgreSQL and CDN Storage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-amber-300/80 border-t border-amber-900/40">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" /> Health & Lineage Verified
            </span>
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" /> Dynamic Supabase CDN Delivery
            </span>
          </div>
        </div>

        {/* Dynamic Grid Section */}
        <section className="space-y-6">
          <LivestockGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}
