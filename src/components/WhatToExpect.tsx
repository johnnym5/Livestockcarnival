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
  subtitle?: string;
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
    tabLabel: '03. Fashion Parade',
    eyebrow: 'SIGNATURE RUNWAY & CULTURAL ARTS',
    title: 'Livestock Cultural Fashion & Pageant',
    subtitle: 'Where Agriculture Meets Fashion, Traditional Costumes & Pageantry',
    summary: 'Experience Nigeria’s first-ever livestock fashion runway with prize cattle draped in Aso-Oke, alongside traditional dance troupes from 36 states, and the Queen/King NLC Pageant.',
    image: '/assets/home/story-live-concert-stage.jpg',
    location: 'Mainstage Arena & Fashion Runway',
    dateBadge: 'Nov 21 & 22 · Fashion Arena',
    ctaText: 'Explore Fashion Showcase',
    ctaLink: '/fashion-parade',
    activities: [
      'Queen and King of National Livestock Carnival (NLC) Pageant',
      'Parade Floats showcase featuring welfare-conscious animal costume pageantry',
      'Cultural dance troupes representing all 36 States and the FCT',
      'Hand-loomed Aso-Oke, Isiagu, and George silk traditional animal styling',
      'Open crafted, visual, needlework, culinary, and garden entries display'
    ]
  },
  {
    id: 'live-auction',
    tabLabel: '04. RFID Auctions',
    eyebrow: 'COMMERCIAL LIVESTOCK EXCHANGE',
    title: 'Live Auction & Digital RFID Bidding',
    subtitle: 'Precision Live-Weight Kilogram Trading with Instant Electronic Settlement',
    summary: 'Transitioning Nigerian livestock commerce from visual estimation to certified digital scales, transparent farm-gate pricing, and high-stakes seedstock auctions.',
    image: '/assets/home/story-digital-rfid-livestock-tag.jpg',
    location: 'Zone 1: Auction Ring & Trade Pavilion',
    dateBadge: 'Nov 22 & 23 · Auction Arena',
    ctaText: 'View Trading Schedule',
    ctaLink: '/schedule',
    activities: [
      'Live commercial livestock auction with RFID digital bidding in the Auction Arena',
      'High-Stakes Seedstock Auction for elite breeding bulls and dromedary camels',
      'Certified digital scale live-weight kilogram trading demonstrations',
      'Bank of Agriculture & commercial settlement kiosks for cash-free transactions',
      'Meat and dairy processing technology exhibition'
    ]
  },
  {
    id: 'investment-summit',
    tabLabel: '05. Investment Summit',
    eyebrow: 'SOVEREIGN CAPITAL & AGRO-FINANCING',
    title: 'Agro-Investment Summit & Agropreneurs',
    subtitle: 'Institutional Roundtables, Concessionary Loans & Capital Matching',
    summary: 'High-level institutional roundtables connecting sovereign funds, commercial banking partners, and agropreneurs for cold-chain, feedlot, and processing capital expansion.',
    image: '/assets/home/story-carnival-entrance-gate.jpg',
    location: 'Marquee 1 & Hall B',
    dateBadge: 'Nov 22 · 9:00 AM – 1:00 PM',
    ctaText: 'Visit Agribusiness Hub',
    ctaLink: '/nhesics',
    activities: [
      'Marquee 1: Agro-Investors Roundtable & Sovereign Capital Briefing',
      'Hall B: Agropreneur Financing Workshop with commercial partners',
      'Bank of Industry (BOI) single-digit concessionary loan facilities matching',
      'B2B buyer-supplier meet and bilateral trade contract signings',
      'NHESICS export certification and cold-chain infrastructure briefings'
    ]
  },
  {
    id: 'pastoralist-forum',
    tabLabel: '06. Pastoralist Forum',
    eyebrow: 'COOPERATIVE DIALOGUE & HARMONIZATION',
    title: 'National Pastoralist Forum & Grants',
    subtitle: 'Stakeholder Cooperation, Regional Cooperative Harmonization & Development Grants',
    summary: 'Constructive dialogues between MACBAN, Kautal Hore, and agricultural ministries establishing pasture-to-seaport supply agreements and cooperative development grants.',
    image: '/assets/home/story-etagging-veterinary.jpg',
    location: 'Conference Hall A',
    dateBadge: 'Nov 22 · 3:30 PM – 6:00 PM',
    ctaText: 'Explore Cooperative Forum',
    ctaLink: '/about',
    activities: [
      'MACBAN & Kautal Hore leadership dialogue in Conference Hall A',
      'Regional cooperative harmonization & pastoral development awards',
      'Signing of bilateral pasture-to-seaport supply contracts',
      'Pastoralist cooperative productivity grants announcement & conferral',
      'Mobile RFID e-tagging and biosecurity telemetry clinics'
    ]
  },
  {
    id: 'cattle-judging',
    tabLabel: '07. Cattle Judging',
    eyebrow: 'GENETICS & BREED EXCELLENCE',
    title: 'National Cattle Formation & Conformation Judging',
    subtitle: 'Elite Purebred Gudali, White Fulani, Bunaji & Bororo Evaluation',
    summary: 'Certified veterinary judges evaluate skeletal conformation, weight-for-age, and milk/meat genetic potential across Nigeria’s premier purebred cattle lines.',
    image: '/assets/livestock/breed-bull-cattle.jpg',
    location: 'Main Show Ring (Zone 1)',
    dateBadge: 'Nov 22 & 23 · Main Ring',
    ctaText: 'Explore Cattle Breeds',
    ctaLink: '/livestock',
    activities: [
      'Main Show Ring: Cattle formation & conformation judging (Gudali, Bunaji, Bororo)',
      'Scoring: Skeletal vigor, mass, weight-for-age, and milk/meat ratios',
      'AI (Artificial Insemination) & genetic improvement clinics for smallholders',
      'Official breed studbook registry certificates issued on site',
      'Presidential gold medals & Breeder of the Year honors'
    ]
  },
  {
    id: 'small-ruminants',
    tabLabel: '08. Goat & Sheep Shows',
    eyebrow: 'SMALL RUMINANTS CHAMPIONSHIP',
    title: 'Sheep & Goat Breed Competitions & Dairy Shows',
    subtitle: 'Balami, Uda, Yankasa, Red Sokoto & Maradi Championships',
    summary: 'Specialized showmanship heats, dairy goat shows across Junior and Senior Does divisions, and youth breeding competitions for small ruminants.',
    image: '/assets/livestock/breed-goat-sheep.jpg',
    location: 'Goat & Sheep Show Rings',
    dateBadge: 'Nov 22 · Goat Show Ring',
    ctaText: 'View Ruminants Program',
    ctaLink: '/livestock',
    activities: [
      'Sheep & Goat Breed Competitions (Balami, Uda, Yankasa, Red Sokoto, Maradi)',
      'Dairy Goat Shows: Junior Does & Senior Does divisions in Show Rings 1 & 2',
      'Show Ring 3: Goat showmanship contest, Youth Market goat show & Meat goat show',
      'Youth dairy and meat breeding goat check-in & health inspection',
      'Artisanal leatherwork & goat skin craft demonstrations'
    ]
  },
  {
    id: 'pet-arts-shows',
    tabLabel: '09. Pet & Arts Shows',
    eyebrow: 'FAMILY & PET SHOWMANSHIP',
    title: 'Pet Agility Shows, Children Workshops & Arts Judging',
    subtitle: 'Rabbit Check-Ins, Dog Agility, Cat Showmanship & Quilt Judging',
    summary: 'Family-friendly highlights including youth rabbit check-ins, dog agility contests, cat showmanship, traditional quilt judging, and children’s agro-education workshops.',
    image: '/assets/home/story-puppy-petting-kids.jpg',
    location: 'Children’s Pavilion & Event Tent',
    dateBadge: 'Nov 23 · Event Tent & Marquee',
    ctaText: 'View Family Attractions',
    ctaLink: '/attractions',
    activities: [
      'Youth Rabbit Show check-in and animal inspection in the Event Tent',
      'Interactive agro-education workshops & children’s petting zoo',
      'Field Ring: Dog show & agility showmanship contest',
      'Event Tent: Cat show check-in and feline showmanship contest',
      'Arts Marquee: Open crafted, visual, home arts, and gardening judging',
      'Public Hall: Traditional quilt & woven textile judging'
    ]
  },
  {
    id: 'concerts-fireworks',
    tabLabel: '10. Concerts & Finale',
    eyebrow: 'NIGHTLY AGRITAINMENT & FINALE',
    title: 'Star Concerts, Gala Dinner & Laser Fireworks',
    subtitle: 'Headlining Nigerian Stars, Stand-Up Comedy & Laser Light Show',
    summary: 'Unforgettable evening agritainment featuring headlining concerts with top Nigerian artists, stand-up comedy, closing ministerial press conference, and laser fireworks.',
    image: '/assets/home/story-live-concert-stage.jpg',
    location: 'Mainstage Arena & Amphitheater',
    dateBadge: 'Nov 22 & 23 · Mainstage',
    ctaText: 'View Concert Lineup',
    ctaLink: '/schedule',
    activities: [
      'Gala Pavilion: Executive dinner & stand-up comedy showcase',
      'Mainstage: Agritainment Concert Night 1 featuring Top Nigerian Artist #1',
      'Closing Ministerial Press Conference & Steering Committee communique readout',
      'Grand Finale Concert featuring superstar Top Nigerian Artist #2',
      'Synchronized laser light show & closing fireworks display over Abuja sky'
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

        {/* Tab Selector Buttons (Horizontal Scrollable on Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-3 scrollbar-none justify-start md:justify-center">
          {CARNIVAL_EXPECTATIONS.map((item, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveIdx(idx);
                  setProgress(0);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
          className="relative w-full max-w-6xl mx-auto min-h-[600px] sm:min-h-[520px]"
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
          <div className="relative w-full min-h-[600px] sm:min-h-[520px]">
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
                  <div className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-[600px] sm:min-h-[520px]">

                    {/* MOBILE-OPTIMIZED IMAGE AT TOP / RIGHT COLUMN ON DESKTOP */}
                    <div className="lg:col-span-6 lg:order-2 relative h-56 sm:h-72 lg:h-full w-full overflow-hidden bg-slate-900 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={offset === 0}
                      />
                      <div className="absolute inset-0 pointer-events-none hidden lg:block z-20 bg-gradient-to-r from-white via-white/10 to-transparent" />
                      <div className="absolute inset-0 pointer-events-none lg:hidden z-20 bg-gradient-to-b from-transparent via-transparent to-white" />
                    </div>

                    {/* EDITORIAL DETAILS COLUMN (BELOW IMAGE ON MOBILE / LEFT ON DESKTOP) */}
                    <div className="lg:col-span-6 lg:order-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white z-20 overflow-y-auto">
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
                        <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] leading-[1.15] tracking-tight mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-[#8D6B1B] mb-3 sm:mb-4">
                          {item.subtitle}
                        </p>

                        {/* Summary */}
                        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mb-5">
                          {item.summary}
                        </p>

                        {/* Scheduled Ground Activities List */}
                        <div className="bg-[#F8FAF9] border border-slate-200/80 rounded-2xl p-4 space-y-2 mb-5 max-h-[170px] overflow-y-auto">
                          <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#1E4D38]" /> Scheduled Activities:
                          </h4>
                          <ul className="space-y-1.5">
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
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
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

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Left & Right Switch Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-slate-200 text-[#111827] flex items-center justify-center shadow-md hover:bg-[#1E4D38] hover:text-white transition-all active:scale-95"
            aria-label="Previous Highlight"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-slate-200 text-[#111827] flex items-center justify-center shadow-md hover:bg-[#1E4D38] hover:text-white transition-all active:scale-95"
            aria-label="Next Highlight"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Index Counter */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <span className="text-xs font-bold text-[#6B7280]">
            Highlight {activeIdx + 1 < 10 ? `0${activeIdx + 1}` : activeIdx + 1} of {CARNIVAL_EXPECTATIONS.length}
          </span>
        </div>

      </div>
    </section>
  );
}
