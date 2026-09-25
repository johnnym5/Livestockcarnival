'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import MagazineRow from '@/components/MagazineRow';
import carnivalData from '@/data/carnival.json';

// Individual livestock showcase items
const livestockList = [
  {
    id: 'bull-cow',
    name: 'Bulls & Cattle',
    species: 'White Fulani · Sokoto Gudali · Bunaji',
    description: 'Prized sovereign genetics, conformation judging, and live-weight precision trading.',
    image: '/assets/livestock_bull_cow.jpg',
    tag: 'Elite Genetics',
  },
  {
    id: 'camel',
    name: 'Golden Camels',
    species: 'Sahelian Dromedary · Royal Caravans',
    description: 'Centuries of desert heritage, pageantry racing, and milk/meat exhibition.',
    image: '/assets/livestock_camel.jpg',
    tag: 'Royal Heritage',
  },
  {
    id: 'goat-sheep',
    name: 'Goats & Sheep',
    species: 'Red Sokoto · Yankasa · West African Dwarf',
    description: 'Premier small ruminant auctions, artisanal leather, and breeding studbooks.',
    image: '/assets/livestock_goat_sheep.jpg',
    tag: 'Small Ruminants',
  },
  {
    id: 'poultry',
    name: 'Poultry & Birds',
    species: 'Indigenous Chickens · Ducks · Broilers',
    description: 'Commercial aviculture incubation, free-range feed systems, and farm-gate supply.',
    image: '/assets/livestock_poultry.jpg',
    tag: 'Commercial Aviculture',
  },
  {
    id: 'aquaculture',
    name: 'Fish & Aquaculture',
    species: 'African Catfish · Tilapia · Aqua-culture',
    description: 'High-density tank systems, fingerling hatcheries, and maritime cold-chain export.',
    image: '/assets/livestock_aquaculture.jpg',
    tag: 'Blue Economy',
  },
];

export default function Home() {
  const rows = carnivalData.magazineRows;
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Background rotators cycling smoothly through individual livestock
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % livestockList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="w-full bg-[#FBFBFA] flex flex-col items-center overflow-x-hidden">
      {/* 1. HIGH-FASHION HERO SECTION WITH CYCLING INDIVIDUAL LIVESTOCK BACKGROUNDS */}
      <section className="relative w-full min-h-[94vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#111827] pt-32 pb-24">
        {/* Animated Background Display of Individual Livestock */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="sync">
            <motion.div
              key={livestockList[activeHeroIndex].id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={livestockList[activeHeroIndex].image}
                alt={livestockList[activeHeroIndex].name}
                fill
                priority
                className="object-cover object-center brightness-[0.42] contrast-[1.08]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ambient Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#111827]/75 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(17,24,39,0.7)_100%)] z-10 pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center">
          {/* Sovereign Eyebrow Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 mb-6"
          >
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                color: '#D4AF37',
              }}
              className="font-extrabold uppercase"
            >
              FEDERAL REPUBLIC OF NIGERIA · OFFICIAL SOVEREIGN CARNIVAL &amp; EXPO
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight max-w-4xl mb-6"
          >
            The Sovereign Festival of Culture, Gastronomy &amp; Agribusiness
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-gray-200 font-normal leading-relaxed max-w-3xl mb-10"
          >
            Showcasing the entire Nigerian livestock spectrum - championship bulls &amp; cows, golden camels, goats, sheep, poultry, and aquaculture - alongside royal Durbar pageantry, open-flame suya, and international trade.
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12"
          >
            <a
              href="https://gcc-carnival.web.app/ticket"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#C49F27] text-[#111827] text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] rounded-xl transition-all shadow-button hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Claim Free Gate Pass</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="https://nlf-vendors.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#1E4D38] hover:bg-[#163B2B] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.15em] rounded-xl border border-[#B8D8C5]/30 transition-all shadow-md flex items-center justify-center"
            >
              Exhibitor &amp; Vendor Booking
            </a>

            <Link
              href="/venue-map"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.15em] rounded-xl backdrop-blur-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>GIS Venue Map</span>
            </Link>
          </motion.div>

          {/* Interactive Livestock Carousel Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-white/10 w-full max-w-3xl">
            {livestockList.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveHeroIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeHeroIndex === idx
                    ? 'bg-[#D4AF37] text-[#111827] shadow-md scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeHeroIndex === idx ? 'bg-[#111827]' : 'bg-[#D4AF37]'}`} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Currently featured animal caption */}
          <div className="mt-3 text-xs text-gray-400">
            Now Viewing: <strong className="text-white">{livestockList[activeHeroIndex].species}</strong> - {livestockList[activeHeroIndex].tag}
          </div>
        </div>
      </section>

      {/* 2. DIVERSE LIVESTOCK SPECTRUM GALLERY SECTION (INDIVIDUAL SHOWCASE CARDS) */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-[#1E4D38] uppercase bg-[#D8EADF] px-4 py-1.5 rounded-full inline-block mb-3">
            National Livestock Spectrum
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
            Celebrating Every Sector of Nigerian Livestock Wealth
          </h2>
          <p className="text-base sm:text-lg text-[#4B5563] max-w-3xl mx-auto leading-relaxed">
            The 2026 Festival unites pastoralists, breeders, poultry farmers, and fish cultivators from all 36 States and the FCT.
          </p>
        </div>

        {/* 5-Card High-Fashion Livestock Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {livestockList.map((animal) => (
            <div
              key={animal.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              {/* Individual Animal Image Frame */}
              <div className="relative w-full h-64 overflow-hidden bg-slate-100">
                <Image
                  src={animal.image}
                  alt={animal.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 right-4 bg-[#111827]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  {animal.tag}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] mb-1.5 group-hover:text-[#1E4D38] transition-colors">
                    {animal.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#8D6B1B] uppercase tracking-wider mb-3">
                    {animal.species}
                  </div>
                  <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
                    {animal.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#1E4D38]">
                    <ShieldCheck className="w-4 h-4 text-[#1E4D38]" />
                    <span>Certified Exhibition Breed</span>
                  </div>
                  <Link
                    href="/attractions#meat-market"
                    className="text-xs font-bold text-[#1E4D38] hover:text-[#8D6B1B] transition-colors inline-flex items-center gap-1"
                  >
                    <span>View Stalls</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ALTERNATING FULL-BLEED MAGAZINE ROWS (ZIG-ZAG LAYOUT) */}
      <div className="w-full flex flex-col">
        {rows.map((row: any, index: number) => (
          <MagazineRow
            key={row.id || index}
            eyebrow={row.eyebrow || row.kicker || 'HIGHLIGHT'}
            title={row.title || row.headline || ''}
            body={row.body}
            image={row.image}
            images={row.images}
            imageAlt={row.imageAlt}
            ctaText={row.ctaText || row.cta?.label || 'Explore Details'}
            ctaLink={row.ctaLink || row.cta?.href || '/attractions'}
            isTextLeft={index % 2 === 0}
          />
        ))}
      </div>

      {/* 4. CLOSING EDITORIAL BANNER */}
      <section className="w-full py-24 bg-[#111827] text-white relative overflow-hidden border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 text-center relative z-10 flex flex-col items-center">
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              color: '#D4AF37',
            }}
            className="font-extrabold uppercase mb-4"
          >
            21 – 23 NOVEMBER 2026 · ABUJA NATIONAL GROUNDS
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mb-6">
            Join the Sovereign Celebration of Heritage, Culture &amp; Agribusiness
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mb-10 leading-relaxed font-normal">
            Admission to the public grounds, Durbar viewing arenas, livestock pavilions, and cultural villages is complimentary for all registered citizens and delegates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="https://gcc-carnival.web.app/ticket"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#C49F27] text-[#111827] text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] rounded-xl transition-all shadow-button hover:shadow-lg"
            >
              Claim Free Gate Pass →
            </a>
            <a
              href="https://nlf-vendors.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.15em] rounded-xl border border-white/30 transition-all"
            >
              Exhibitor &amp; Vendor Booking
            </a>
            <Link
              href="/schedule"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-200 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] rounded-xl border border-white/15 transition-all"
            >
              View 3-Day Program
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
