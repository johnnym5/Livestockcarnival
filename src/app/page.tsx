'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, Star, Users, Calendar, Award } from 'lucide-react';
import MagazineRow from '@/components/MagazineRow';
import CardStackContainer from '@/components/motion/CardStackContainer';
import carnivalData from '@/data/carnival.json';
import { dramaticEase } from '@/lib/motion';

const livestockList = [
  {
    id: 'bull-cow',
    name: 'Bulls & Cattle',
    species: 'White Fulani · Sokoto Gudali · Bunaji',
    description: 'Prized genetics, conformation judging, and live-weight precision trading.',
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

const stats = [
  { icon: Users, value: '50,000+', label: 'Expected Visitors' },
  { icon: Star, value: '200+', label: 'Exhibitors & Vendors' },
  { icon: Calendar, value: '3 Days', label: 'Festival Duration' },
  { icon: Award, value: '36 States', label: 'National Coverage' },
];

export default function Home() {
  const rows = carnivalData.magazineRows;
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % livestockList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="w-full bg-[#FBFBFA] flex flex-col items-center overflow-x-hidden">

      {/* ── 1. CINEMATIC HERO ── */}
      <section className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#0A1A10] pt-24 pb-24 md:pb-32">
        {/* Cycling Background Images */}
        <div className="absolute inset-0 w-full h-full z-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={livestockList[activeHeroIndex].id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={livestockList[activeHeroIndex].image}
                alt={livestockList[activeHeroIndex].name}
                fill
                priority
                className="object-cover object-center brightness-[0.35] contrast-[1.1] saturate-[0.9]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Layered Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A10] via-[#0A1A10]/20 to-[#0A1A10]/60 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A10]/50 via-transparent to-[#0A1A10]/50 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,26,16,0.75)_100%)] z-10 pointer-events-none" />

        {/* Ambient gold glow at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#E4B03A]/8 blur-[80px] z-10 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: dramaticEase }}
            className="relative w-36 h-24 sm:w-44 sm:h-28 md:w-52 md:h-32 mb-6"
          >
            <Image
              src="/assets/logo_transparent.png"
              alt="Livestock Carnival Official Emblem"
              fill
              priority
              sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
              className="object-contain drop-shadow-[0_12px_30px_rgba(228,176,58,0.4)]"
            />
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: dramaticEase }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-[#E4B03A]/70" />
            <span
              className="font-extrabold uppercase"
              style={{ fontSize: '0.7rem', letterSpacing: '0.26em', color: '#D4AF37' }}
            >
              FEDERAL REPUBLIC OF NIGERIA · OFFICIAL CARNIVAL &amp; EXPO
            </span>
            <span className="w-8 h-px bg-[#E4B03A]/70" />
          </motion.div>

          {/* Main Headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 80, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.25, ease: dramaticEase }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.06] tracking-tight max-w-5xl"
            >
              Welcome to the{' '}
              <span className="text-[#E4B03A]">RENEWED HOPE</span>{' '}
              NATIONAL LIVESTOCK CARNIVAL 2026
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: dramaticEase }}
            className="text-base sm:text-lg md:text-xl text-gray-300/90 font-normal leading-relaxed max-w-3xl mb-10"
          >
            Experience Nigeria&apos;s grandest celebration of culture, music, food, and farming &mdash; featuring royal horses, camels, championship cattle, open-flame suya, live concerts, and trade exhibitions.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.55, ease: dramaticEase }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12"
          >
            <a
              href="https://pass.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#E4B03A] hover:bg-[#D4A030] text-[#0A1A10] text-xs sm:text-sm font-extrabold uppercase tracking-[0.16em] rounded-xl transition-all shadow-button hover:shadow-[0_16px_40px_-4px_rgba(228,176,58,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              <span>Claim Free Gate Pass</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="https://vendors.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#1E4D38]/80 hover:bg-[#1E4D38] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.16em] rounded-xl border border-[#B8D8C5]/30 transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center"
            >
              Exhibitor &amp; Vendor Booking
            </a>

            <Link
              href="/venue-map"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/18 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.16em] rounded-xl backdrop-blur-sm border border-white/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#E4B03A]" />
              <span>GIS Venue Map</span>
            </Link>
          </motion.div>

          {/* Species Switcher Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.7, ease: dramaticEase }}
            className="flex flex-wrap items-center justify-center gap-2 pt-5 border-t border-white/10 w-full max-w-3xl"
          >
            {livestockList.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveHeroIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeHeroIndex === idx
                    ? 'bg-[#E4B03A] text-[#0A1A10] shadow-md scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeHeroIndex === idx ? 'bg-[#0A1A10]' : 'bg-[#E4B03A]'}`} />
                <span>{item.name}</span>
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-3 text-xs text-gray-400"
          >
            Now Viewing: <strong className="text-white">{livestockList[activeHeroIndex].species}</strong> &mdash; {livestockList[activeHeroIndex].tag}
          </motion.div>
        </div>

        {/* Hero to Body Gradient Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 md:h-72 z-20 pointer-events-none bg-gradient-to-b from-transparent via-[#0A1A10]/60 to-[#FBFBFA]" />
      </section>

      {/* ── 2. STATS STRIP ── */}
      <section className="w-full py-12 bg-[#FBFBFA]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: dramaticEase }}
                className="text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card card-lift"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D8EADF] text-[#1E4D38] flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-[#111827] mb-1">{stat.value}</div>
                <div className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FRAMER MOTION CARD STACK MAGAZINE ROWS ── */}
      <section className="w-full py-16 md:py-24 bg-[#FBFBFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: dramaticEase }}
          >
            <span className="text-xs font-extrabold tracking-[0.26em] text-[#1E4D38] uppercase bg-[#D8EADF] px-4 py-1.5 rounded-full inline-block mb-4">
              Highlights &amp; Signature Arenas
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: 0.1, ease: dramaticEase }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight mb-3"
          >
            Explore the Festival Story
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: dramaticEase }}
            className="w-16 h-0.5 bg-[#E4B03A] mx-auto"
            style={{ transformOrigin: 'center' }}
          />
        </div>

        <CardStackContainer topOffsetStart={100} topOffsetIncrement={25}>
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
        </CardStackContainer>
      </section>

      {/* ── 4. EDITORIAL CLOSING BANNER ── */}
      <section className="w-full py-24 bg-[#0F2A1A] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E4B03A]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(228,176,58,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#1E4D38]/40 blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 text-center z-10 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: dramaticEase }}
            className="font-extrabold uppercase mb-5 inline-flex items-center gap-3"
            style={{ fontSize: '0.72rem', letterSpacing: '0.28em', color: '#E4B03A' }}
          >
            <span className="w-8 h-px bg-[#E4B03A]/60" />
            21 – 23 NOVEMBER 2026 · ABUJA NATIONAL GROUNDS
            <span className="w-8 h-px bg-[#E4B03A]/60" />
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.1, ease: dramaticEase }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mb-6 tracking-tight"
          >
            Join the Celebration of Heritage, Culture &amp; Agribusiness
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: dramaticEase }}
            className="text-base sm:text-lg text-gray-300/85 max-w-2xl mb-10 leading-relaxed"
          >
            Admission to the public grounds, Durbar viewing arenas, livestock pavilions, and cultural villages is complimentary for all registered citizens and delegates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: dramaticEase }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <a
              href="https://pass.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#E4B03A] hover:bg-[#D4A030] text-[#0A1A10] text-xs sm:text-sm font-extrabold uppercase tracking-[0.16em] rounded-xl transition-all shadow-button hover:shadow-[0_16px_40px_-4px_rgba(228,176,58,0.5)] hover:-translate-y-1"
            >
              Claim Free Gate Pass &rarr;
            </a>
            <a
              href="https://vendors.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.16em] rounded-xl border border-white/25 transition-all hover:-translate-y-0.5"
            >
              Exhibitor &amp; Vendor Booking
            </a>
            <Link
              href="/schedule"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/12 text-gray-200 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] rounded-xl border border-white/12 transition-all hover:-translate-y-0.5"
            >
              View 3-Day Program
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
