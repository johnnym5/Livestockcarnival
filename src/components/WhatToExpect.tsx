'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, Calendar, MapPin } from 'lucide-react';

interface ExpectationItem {
  id: string;
  tabLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  summary: string;
  image: string;
  location: string;
  dateBadge: string;
  ctaText: string;
  ctaLink: string;
  activities: string[];
}

const CARNIVAL_EXPECTATIONS: ExpectationItem[] = [
  {
    id: 'durbar-cavalry',
    tabLabel: '01. Royal Durbar',
    eyebrow: 'DAY 1 · ROYAL CAVALRY & HERITAGE',
    title: 'Royal Horse Cavalry & Durbar Parade',
    subtitle: 'Centuries of Northern Royalty, Pageantry & Desert Heritage',
    summary: 'Witness over 200 ceremonial cavalry war stallions, traditional Northern horsemen, camel pageantry, and royal racing displays in a breathtaking celebration of national heritage.',
    image: '/assets/home/story-equestrian-durbar-parade.jpg',
    location: 'Zone 3: Central Track & Oval',
    dateBadge: 'Friday, 21 Nov 2026',
    ctaText: 'Explore Equestrian Schedule',
    ctaLink: '/schedule',
    activities: [
      'VIP Arrival, Red Carpet Reception & Security Sweep by Police, Military & Agro-Rangers',
      'Ribbon Cutting & Official Opening by the Hon. Minister of Livestock Development',
      'Grand Opening Parade of prize Bunaji bulls, Sahelian camels, and equines',
      'Kano Durbar Horsemen ceremonial equestrian display & royal cavalry salutes',
      'Midway Opening, live cultural troupes, animal costume parade floats, beer garden & karaoke'
    ]
  },
  {
    id: 'suya-village',
    tabLabel: '02. Suya Village',
    eyebrow: 'GASTRONOMY & STREET FOOD CULTURE',
    title: 'Open-Flame Suya Village & Artisanal Fest',
    subtitle: 'Nigeria’s Largest Outdoor Grilling & Artisanal Smoked Meats Pavilion',
    summary: "Indulge in Nigeria's largest outdoor open-flame grilling arena. Featuring master Suya chefs, artisanal Kilishi cutting demonstrations, organic spice markets, and family festival dining.",
    image: '/assets/home/story-suya-grill-fire.jpg',
    location: 'Zone 2: Culinary Village',
    dateBadge: 'Daily 12:00 PM – 11:00 PM',
    ctaText: 'Discover Culinary Village',
    ctaLink: '/attractions#suya-village',
    activities: [
      'Master Suya Guild national championship & secret spice blend showcase',
      'Artisanal Kilishi craft demonstrations & vacuum-sealed export packaging',
      'Live-weight meat processing, hygienic prep zones & continuous temperature control',
      'Open-air garden acoustic music, evening karaoke & late-night artisanal roasting'
    ]
  },
  {
    id: 'culture-fashion',
    tabLabel: '03. Fashion & Concerts',
    eyebrow: 'SIGNATURE RUNWAY & LIVE MUSIC STAGE',
    title: 'Livestock Cultural Fashion & Star Concerts',
    subtitle: 'Where Agriculture Meets Fashion, Traditional Pageantry & Live Concerts',
    summary: 'Experience Nigeria’s first-ever livestock fashion runway with prize cattle draped in Aso-Oke, alongside traditional dance troupes, Queen/King NLC Pageant, and headlining concerts with top Nigerian stars.',
    image: '/assets/home/story-live-concert-stage.jpg',
    location: 'Mainstage Arena & Fashion Runway',
    dateBadge: 'Nightly 6:00 PM – 11:00 PM',
    ctaText: 'View Concert Lineup',
    ctaLink: '/schedule',
    activities: [
      'Queen and King of National Livestock Carnival (NLC) Pageant',
      'Parade Floats showcase featuring welfare-conscious animal costume pageantry',
      'Cultural dance troupes representing all 36 States and the FCT',
      'Agritainment Concert Night 1 featuring Top Nigerian Artist #1',
      'Grand Finale Concert featuring superstar Top Nigerian Artist #2 & Laser Light Show'
    ]
  },
  {
    id: 'trade-tech',
    tabLabel: '04. B2B & Agribusiness',
    eyebrow: 'DAY 2 & 3 · TRADE, FINANCING & B2B MATCHMAKING',
    title: 'Agribusiness, Tech & B2B Matchmaking Hub',
    subtitle: 'Commercial Trade Agreements, RFID Auctions & Agropreneur Capital',
    summary: 'Explore multi-sector commercial pavilions featuring high-tech agricultural machinery, digital livestock e-tagging platforms, direct B2B investor contract signings, and cold-chain export logistics.',
    image: '/assets/home/story-carnival-entrance-gate.jpg',
    location: 'Zone 4: B2B Marquee & Tech Hub',
    dateBadge: 'Nov 22 – 23 · 9:00 AM – 5:00 PM',
    ctaText: 'Visit Innovation Hub',
    ctaLink: '/nhesics',
    activities: [
      'Agro-Investors Roundtable & Sovereign Capital Briefing',
      'Agropreneur Financing Workshop with commercial banking partners',
      'Live Commercial & Seedstock Auctions with RFID digital bidding',
      'B2B Supplier Meet & direct trade agreements signing',
      'National Pastoralist Forum: MACBAN & Kautal Hore dialogue & cooperative grants'
    ]
  },
  {
    id: 'championship-judging',
    tabLabel: '05. Breed Championships',
    eyebrow: 'LIVESTOCK CHAMPIONSHIP & PET SHOWS',
    title: 'Supreme Breed Judging & Pet Showmanship',
    subtitle: 'Conformation Judging, Genetics Showcase & Pet Agility Contests',
    summary: 'Watch supreme livestock judging competitions across cattle, sheep, goats, poultry, and camels alongside youth rabbit shows, dog showmanship, and cat competitions.',
    image: '/assets/attractions/arena-breed-judging-court.jpg',
    location: 'Zone 1: Beef Show Ring & Pet Arena',
    dateBadge: 'Nov 22 – 23 · Judging Court',
    ctaText: 'View Championship Schedule',
    ctaLink: '/schedule',
    activities: [
      'National Cattle Formation & Conformation Judging (Bunaji, Gudali, Bororo)',
      'Sheep & Goat Breed Competitions (Balami, Uda, Yankasa, Maradi)',
      'Dairy Goat Shows (Jr. & Sr. Does) & Goat Showmanship heats',
      'Youth Rabbit Show Check-In & Youth Market Goat Championship',
      'Dog Show & Agility Showmanship, Cat Show, and Children’s Agro-Education Workshop',
      'Beef Show Ring Livestock Judging Awards & Breed Champions Trophy Presentation'
    ]
  }
];

export default function WhatToExpect() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % CARNIVAL_EXPECTATIONS.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + CARNIVAL_EXPECTATIONS.length) % CARNIVAL_EXPECTATIONS.length);
    setProgress(0);
  }, []);

  // 5-second auto rotation timer
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50;
    const totalTime = 5000;
    const step = (intervalTime / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section className="w-full py-16 sm:py-24 bg-[#FBFBFA] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block bg-[#D8EADF] text-[#1E4D38] px-5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3.5 shadow-sm">
            WHAT TO EXPECT
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight mb-3">
            Explore the Carnival Program &amp; Attractions
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            A synchronized 3-day experience marrying royal equestrian pageantry, artisanal gastronomy, live auctions, B2B matchmaking, and star-studded concerts.
          </p>
          <div className="w-16 h-0.5 bg-[#E4B03A] mx-auto mt-5" />
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {CARNIVAL_EXPECTATIONS.map((item, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveIdx(idx);
                  setProgress(0);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E4D38] text-white shadow-card scale-105'
                    : 'bg-white border border-slate-200 text-[#4B5563] hover:border-[#B8D8C5] hover:text-[#111827]'
                }`}
              >
                {item.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Card Stack Deck Container */}
        <div
          className="relative w-full max-w-6xl mx-auto min-h-[520px] sm:min-h-[500px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* 5-Second Progress Line */}
          <div className="w-full h-1.5 bg-slate-100 rounded-t-3xl overflow-hidden z-40 relative">
            <div
              className="h-full bg-[#1E4D38] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Layered Card Stack Deck */}
          <div className="relative w-full min-h-[520px] sm:min-h-[500px]">
            {CARNIVAL_EXPECTATIONS.map((item, index) => {
              const total = CARNIVAL_EXPECTATIONS.length;
              const offset = (index - activeIdx + total) % total;

              // Display top 3 cards in depth stack
              if (offset > 2) return null;

              const scale = 1 - offset * 0.04;
              const translateY = offset * 18;
              const zIndex = 30 - offset * 10;
              const opacity = offset === 0 ? 1 : offset === 1 ? 0.85 : 0.6;

              return (
                <motion.div
                  key={item.id}
                  style={{ zIndex }}
                  animate={{
                    scale,
                    y: translateY,
                    opacity,
                  }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0 w-full bg-white border border-slate-200/90 rounded-b-3xl overflow-hidden shadow-card hover:shadow-card-hover"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                    {/* LEFT COLUMN: EDITORIAL DETAILS */}
                    <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white z-20">
                      <div>
                        {/* Eyebrow & Date */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.22em] text-[#8D6B1B] uppercase">
                            {item.eyebrow}
                          </span>
                          <span className="text-[11px] font-bold text-[#1E4D38] bg-[#D8EADF]/60 px-3 py-1 rounded-full flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#1E4D38]" />
                            {item.dateBadge}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] leading-[1.15] tracking-tight mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-[#8D6B1B] mb-4">
                          {item.subtitle}
                        </p>

                        {/* Summary */}
                        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mb-6">
                          {item.summary}
                        </p>

                        {/* Scheduled Ground Activities List */}
                        <div className="bg-[#F8FAF9] border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2 mb-6 max-h-[190px] overflow-y-auto">
                          <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#1E4D38]" /> Scheduled Activities:
                          </h4>
                          <ul className="space-y-2">
                            {item.activities.map((act, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs text-[#374151] leading-snug">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1E4D38] shrink-0 mt-1.5" />
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Bottom Action Row */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#1E4D38]">
                          <MapPin className="w-4 h-4 text-[#1E4D38]" />
                          <span>{item.location}</span>
                        </div>

                        <Link
                          href={item.ctaLink}
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-[0.14em] uppercase text-[#1E4D38] hover:text-[#111827] group transition-colors"
                        >
                          <span>{item.ctaText}</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: HIGH-RES CINEMATIC IMAGE */}
                    <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[360px] lg:min-h-full overflow-hidden bg-slate-900">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={offset === 0}
                      />
                      <div className="absolute inset-0 pointer-events-none hidden lg:block z-20 bg-gradient-to-r from-white via-white/20 to-transparent" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Left & Right Switch Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 border border-slate-200 text-[#111827] flex items-center justify-center shadow-md hover:bg-[#1E4D38] hover:text-white transition-all active:scale-95"
            aria-label="Previous Highlight"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 border border-slate-200 text-[#111827] flex items-center justify-center shadow-md hover:bg-[#1E4D38] hover:text-white transition-all active:scale-95"
            aria-label="Next Highlight"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Index Counter */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <span className="text-xs font-bold text-[#6B7280]">
            Highlight 0{activeIdx + 1} of 0{CARNIVAL_EXPECTATIONS.length}
          </span>
        </div>

      </div>
    </section>
  );
}
