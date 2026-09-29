'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { CheckCircle2, ArrowRight, Calendar, MapPin, Award } from 'lucide-react';

interface ExpectationCard {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  tag: string;
  dateBadge: string;
  ctaText: string;
  ctaLink: string;
  highlights: string[];
}

const CARNIVAL_EXPECTATIONS: ExpectationCard[] = [
  {
    id: 'durbar-cavalry',
    eyebrow: 'DAY 1 · ROYAL CAVALRY & HERITAGE',
    title: 'Royal Horse Cavalry & Durbar Parade',
    summary: 'Witness over 200 ceremonial war stallions, royal Kano Durbar horsemen, adorned camels, and traditional cavalry fanfare in an awe-inspiring celebration of Nigeria’s centuries-old pastoral nobility.',
    image: '/assets/home/story-equestrian-durbar-parade.jpg',
    tag: 'Royal Durbar',
    dateBadge: 'Nov 21 · Main Arena',
    ctaText: 'View Equestrian Schedule',
    ctaLink: '/schedule',
    highlights: [
      '200+ ceremonial cavalry war stallions & royal horsemen in full regalia',
      'Grand opening salute to the Minister of Livestock Development',
      'Parade of champion Bunaji bulls and decorated Sahelian camels',
      'Kano Durbar ceremonial charge & traditional horn fanfare'
    ]
  },
  {
    id: 'suya-village',
    eyebrow: 'GASTRONOMY & STREET FOOD CULTURE',
    title: 'Open-Flame Suya Village & Night Roasting',
    summary: "Indulge in Nigeria's largest outdoor open-flame grilling arena. Featuring master Suya chefs, artisanal Kilishi cutting demonstrations, organic spice markets, and evening dining under the stars.",
    image: '/assets/home/story-suya-grill-fire.jpg',
    tag: 'Artisanal Gastronomy',
    dateBadge: 'Daily 12PM – 11PM · Food Pavilion',
    ctaText: 'Explore Suya Village',
    ctaLink: '/attractions#suya-village',
    highlights: [
      'Master Suya Guild national championship & secret spice blend showcase',
      'Live Kilishi sun-drying craft & vacuum-sealed export packaging',
      'Certified veterinary cold-chain hygiene & temperature monitoring',
      'Open-air garden acoustic rhythms & late-night artisanal roasting'
    ]
  },
  {
    id: 'culture-fashion',
    eyebrow: 'SIGNATURE RUNWAY · WHERE AGRICULTURE MEETS FASHION',
    title: 'Livestock Cultural Fashion Parade',
    summary: 'Experience Nigeria’s first-ever livestock fashion runway. Prize Bunaji bulls, Sahelian camels, and champion rams adorned in hand-woven Aso-Oke drapes, Akwete sashes, and royal leather regalia.',
    image: '/assets/fashion-parade/handler-walking-white-bull-runway.jpg',
    tag: 'Fashion Runway',
    dateBadge: 'Nov 22 · Red Carpet Oval',
    ctaText: 'Explore Fashion Parade',
    ctaLink: '/fashion-parade',
    highlights: [
      'Prize bulls & dromedary camels walked on the red carpet runway',
      'Hand-loomed Aso-Oke, Isiagu motifs, and George silks styling',
      'Ethical animal welfare guidelines verified by Federal Vet Officers',
      'Traditional Kakaki trumpeters, Yoruba talking drums & Ogene rhythms'
    ]
  },
  {
    id: 'concerts-masquerades',
    eyebrow: 'FESTIVAL MUSIC & ARTS CELEBRATION',
    title: 'Live Concerts, Masquerades & Cultural Rhythms',
    summary: 'Immerse in grand cultural spectacles featuring the monumental Ijele masquerade, traditional troupes representing all 36 States and the FCT, alongside headlining concerts with top Nigerian music stars.',
    image: '/assets/home/story-ijele-masquerade.jpg',
    tag: 'Concerts & Arts',
    dateBadge: 'Nightly 6PM – 11PM · Grand Stage',
    ctaText: 'View Concert Lineup',
    ctaLink: '/schedule',
    highlights: [
      'Monumental Ijele Masquerade display & ceremonial processions',
      'Traditional dance ensembles representing the 6 geopolitical zones',
      'Agritainment Concert Night 1 featuring top national artists',
      'Grand Finale Laser Show & Festival Champions Gala'
    ]
  },
  {
    id: 'championship-judging',
    eyebrow: 'DAY 2 & 3 · LIVESTOCK CHAMPIONSHIP & TRADE',
    title: 'Supreme Champion Breed Judging & Trade Expo',
    summary: 'Watch supreme conformation judging across cattle, sheep, goats, and camels, alongside commercial RFID auctions, digital livestock e-tagging demonstrations, and B2B investor contract signings.',
    image: '/assets/fashion-parade/exhibition-bull-and-horse-pens.jpg',
    tag: 'Championship Ring',
    dateBadge: 'Nov 22–23 · Judging Court',
    ctaText: 'View Championship Schedule',
    ctaLink: '/schedule',
    highlights: [
      'National Cattle Conformation Judging (White Fulani, Gudali, Bororo)',
      'Supreme Sheep & Goat Competitions (Balami rams & Maradi goats)',
      'Live commercial auctions with certified digital live-weight scales',
      'Bank of Industry (BOI) agribusiness capital & trade briefings'
    ]
  }
];

function FullScreen3DCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: ExpectationCard;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Normalized scroll time slice per card
  const step = 1 / total; // 0.20 per card
  const start = index * step;
  const peak = start + step * 0.30; // Card fully centered & locked
  const hold = start + step * 0.70; // Card stays in focal view
  const exit = (index + 1) * step; // Card zooms past or exits

  // 1. VERTICAL POSITION (y)
  // - First card: Scrolls UP from below screen (85vh -> 0vh), then LOCKS in center
  // - Middle cards: FIXED AT EXACT SCREEN CENTER (0vh) throughout their entire lifecycle
  // - Last card: Stays in center, then SCROLLS UP out of screen (0vh -> -90vh) to reveal footer
  const y = useTransform(
    scrollYProgress,
    isFirst
      ? [0, peak, exit]
      : isLast
      ? [start, peak, hold, 1]
      : [start, peak, exit],
    isFirst
      ? ['85vh', '0vh', '0vh']
      : isLast
      ? ['0vh', '0vh', '0vh', '-90vh']
      : ['0vh', '0vh', '0vh']
  );

  // 2. 3D ZOOM & SCALE (scale)
  // - Pre-arrival (in depth): scale 0.82
  // - Centered in focus: scale 1.0 (fills screen viewport)
  // - Zooming into screen: scale 2.6 (zooms straight toward viewer camera!)
  // - Last card: holds at 1.0, then scrolls up slightly scaling to 0.92
  const scale = useTransform(
    scrollYProgress,
    isFirst
      ? [0, peak, hold, exit]
      : isLast
      ? [Math.max(0, start - 0.08), start, peak, hold, 1]
      : [Math.max(0, start - 0.08), start, peak, hold, exit],
    isFirst
      ? [0.90, 1.0, 1.0, 2.5]
      : isLast
      ? [0.80, 0.90, 1.0, 1.0, 0.92]
      : [0.80, 0.90, 1.0, 1.0, 2.5]
  );

  // 3. 3D TRANSLATE-Z (depth)
  const z = useTransform(
    scrollYProgress,
    isFirst
      ? [0, peak, hold, exit]
      : isLast
      ? [Math.max(0, start - 0.08), start, peak, hold, 1]
      : [Math.max(0, start - 0.08), start, peak, hold, exit],
    isFirst
      ? [-100, 0, 0, 600]
      : isLast
      ? [-450, -180, 0, 0, 0]
      : [-450, -180, 0, 0, 600]
  );

  // 4. OPACITY (fading)
  // - First card: fades in from bottom (0 -> 1), stays visible, dissolves as it zooms in
  // - Middle cards: emerge from background depth (0 -> 1), hold, dissolve as they zoom forward
  // - Last card: emerges from depth (0 -> 1), holds, then fades out as it scrolls up to footer
  const opacity = useTransform(
    scrollYProgress,
    isFirst
      ? [0, peak * 0.6, hold, exit]
      : isLast
      ? [Math.max(0, start - 0.06), start, peak, hold, 0.98, 1]
      : [Math.max(0, start - 0.06), start, peak, hold, exit],
    isFirst
      ? [0, 1, 1, 0]
      : isLast
      ? [0, 0.5, 1, 1, 0.8, 0]
      : [0, 0.5, 1, 1, 0]
  );

  // 5. CINEMATIC DEPTH BLUR
  const filter = useTransform(
    scrollYProgress,
    isFirst
      ? [0, peak, hold, exit]
      : isLast
      ? [Math.max(0, start - 0.08), peak, hold, 1]
      : [Math.max(0, start - 0.08), peak, hold, exit],
    isFirst
      ? ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(12px)']
      : isLast
      ? ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
      : ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(12px)']
  );

  // Pointer events: only clickable when this card is in active focal view
  const pointerEvents = useTransform(scrollYProgress, (latest) => {
    if (isFirst) {
      return latest < exit ? 'auto' : 'none';
    }
    if (isLast) {
      return latest >= start ? 'auto' : 'none';
    }
    return latest >= start && latest <= exit ? 'auto' : 'none';
  });

  return (
    <motion.div
      style={{
        y,
        scale,
        z,
        opacity,
        filter,
        pointerEvents,
        transformStyle: 'preserve-3d',
        zIndex: total - index,
      }}
      className="absolute inset-0 w-full h-full flex items-center justify-center p-3 sm:p-6 md:p-8"
    >
      {/* SCREEN-FILLING LUXURY EDITORIAL CARD */}
      <div className="relative w-[94vw] max-w-6xl h-[82vh] min-h-[540px] max-h-[780px] bg-[#0A1A10] rounded-3xl border border-[#E4B03A]/30 overflow-hidden shadow-[0_32px_90px_-20px_rgba(0,0,0,0.8)] grid grid-cols-1 lg:grid-cols-12">

        {/* Ambient Decorative Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E4B03A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E4D38]/40 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT COLUMN: EDITORIAL CONTENT (48%) */}
        <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 lg:p-12 z-20 text-white overflow-y-auto">
          <div>
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[10px] sm:text-[11px] font-black tracking-[0.24em] text-[#E4B03A] uppercase bg-[#E4B03A]/15 border border-[#E4B03A]/30 px-3 py-1 rounded-full">
                {card.eyebrow}
              </span>
              <span className="text-[10px] font-semibold text-gray-300 bg-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#E4B03A]" />
                {card.dateBadge}
              </span>
            </div>

            {/* Main Headline */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-serif leading-[1.12] tracking-tight mb-4">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-gray-300/90 leading-relaxed mb-6 font-normal">
              {card.summary}
            </p>

            {/* Scheduled Activities Glass Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md mb-6">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#E4B03A] mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#E4B03A]" /> Key Arena Highlights
              </h4>
              <ul className="space-y-2">
                {card.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200 leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-[#E4B03A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
            <span className="text-xs font-mono font-bold text-[#E4B03A] tracking-widest">
              SHOWCASE 0{index + 1} / 0{total}
            </span>

            <Link
              href={card.ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E4B03A] hover:bg-[#D4A030] text-[#0A1A10] text-xs font-black uppercase tracking-wider shadow-button transition-all hover:-translate-y-0.5"
            >
              <span>{card.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: MASSIVE CINEMATIC PHOTOGRAPHY (52%) */}
        <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[340px] lg:min-h-full overflow-hidden bg-black">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-1000"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority={index < 2}
          />
          {/* Subtle Inner Gradients for Seamless Edge Integration */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0A1A10] via-transparent to-transparent pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-10" />

          {/* Floating Pill on Image */}
          <div className="absolute top-5 right-5 z-20 bg-black/70 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#E4B03A] uppercase tracking-wider shadow-lg">
            {card.tag}
          </div>

          {/* Location Badge on Image */}
          <div className="absolute bottom-5 right-5 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-semibold text-gray-200 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E4B03A]" />
            <span>Old Parade Ground, Area 10, Abuja</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default function WhatToExpect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const cardCount = CARNIVAL_EXPECTATIONS.length;
      const index = Math.min(
        cardCount - 1,
        Math.max(0, Math.floor(latest * cardCount))
      );
      setActiveCardIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0A1A10]"
      style={{
        // 130vh per card allows comfortable, majestic pacing
        height: `${CARNIVAL_EXPECTATIONS.length * 130}vh`,
      }}
    >
      {/* Sticky Full Viewport 3D Theater */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden [perspective:1400px]">

        {/* Ambient Glows inside 3D Viewport */}
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-[#E4B03A]/8 rounded-full blur-[160px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-[#1E4D38]/30 rounded-full blur-[160px] pointer-events-none translate-x-1/2 translate-y-1/2" />

        {/* Ambient Top HUD */}
        <div className="absolute top-6 sm:top-8 z-40 text-center max-w-2xl px-4 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#E4B03A]/20 border border-[#E4B03A]/40 text-[#E4B03A] text-[11px] font-black uppercase tracking-[0.24em] mb-2 shadow-sm">
            <span>SIGNATURE FESTIVAL ARENAS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
            Explore the 2026 Carnival Program
          </h2>
          <p className="text-xs text-gray-400 mt-1 hidden sm:block">
            Scroll down to zoom into each arena &bull; Scroll up to zoom back out
          </p>
        </div>

        {/* Pinned 3D Card Deck Viewport */}
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
          {CARNIVAL_EXPECTATIONS.map((card, index) => (
            <FullScreen3DCard
              key={card.id}
              card={card}
              index={index}
              total={CARNIVAL_EXPECTATIONS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Bottom Floating Navigation HUD */}
        <div className="absolute bottom-6 z-40 flex items-center justify-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2">
            {CARNIVAL_EXPECTATIONS.map((card, idx) => (
              <div
                key={card.id}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeCardIndex === idx
                    ? 'w-8 bg-[#E4B03A]'
                    : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-mono font-bold text-[#E4B03A] border-l border-white/20 pl-3">
            0{activeCardIndex + 1} / 0{CARNIVAL_EXPECTATIONS.length}
          </span>
        </div>

      </div>
    </div>
  );
}
