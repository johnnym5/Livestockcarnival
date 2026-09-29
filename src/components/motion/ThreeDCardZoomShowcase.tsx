'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export interface ThreeDCardItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  tag?: string;
  description: string;
  image: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
}

interface ThreeDCardProps {
  card: ThreeDCardItem;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
}

function ThreeDCard({ card, index, totalCards, scrollYProgress }: ThreeDCardProps) {
  const isFirst = index === 0;
  const isLast = index === totalCards - 1;

  // Each card has a normalized segment of scroll progress
  // Segment spans:
  // Card 0: enters from bottom [0, 1/(total+1)], holds, then zooms forward [1/(total+1), 2/(total+1)]
  const step = 1 / totalCards;
  const cardStart = index * step;
  const cardPeak = cardStart + step * 0.45;
  const cardExit = (index + 1) * step;

  // First card: scrolls up from below (+100vh -> 0)
  // Last card: scrolls up out of screen (0 -> -100vh)
  // Middle cards: fixed at center y = 0
  const y = useTransform(
    scrollYProgress,
    isFirst
      ? [0, cardPeak, cardExit]
      : isLast
      ? [cardStart, cardPeak, 1]
      : [cardStart, cardPeak, cardExit],
    isFirst
      ? ['80vh', '0vh', '0vh']
      : isLast
      ? ['0vh', '0vh', '-90vh']
      : ['0vh', '0vh', '0vh']
  );

  // 3D Scale & Depth Zoom:
  // Pre-arrival: scale 0.75 (in the background)
  // Peak (active in center): scale 1.0 (crisp, focal point)
  // Zooming out / forward: scale 2.2+ (zooms straight into the camera / viewer)
  const scale = useTransform(
    scrollYProgress,
    [cardStart - step * 0.5, cardStart, cardPeak, cardExit],
    [0.72, 0.85, 1.0, isLast ? 1.0 : 2.4]
  );

  // 3D TranslateZ (depth)
  const z = useTransform(
    scrollYProgress,
    [cardStart - step * 0.5, cardStart, cardPeak, cardExit],
    [-400, -200, 0, isLast ? 0 : 500]
  );

  // Opacity:
  // First card fades in from bottom.
  // Middle cards emerge from background depth, peak at 1, dissolve as they zoom forward past camera.
  // Last card fades out as it scrolls up to the footer.
  const opacity = useTransform(
    scrollYProgress,
    isFirst
      ? [0, cardPeak * 0.6, cardPeak, cardExit * 0.85, cardExit]
      : isLast
      ? [cardStart - step * 0.2, cardStart, cardPeak, 0.92, 1]
      : [cardStart - step * 0.2, cardStart, cardPeak, cardExit * 0.88, cardExit],
    isFirst
      ? [0, 0.8, 1, 0.9, 0]
      : isLast
      ? [0, 0.7, 1, 1, 0]
      : [0, 0.6, 1, 0.8, 0]
  );

  // Pointer events: only active when near peak
  const pointerEvents = useTransform(scrollYProgress, (val) => {
    return val >= cardStart && val <= cardExit ? 'auto' : 'none';
  });

  return (
    <motion.div
      style={{
        y,
        scale,
        z,
        opacity,
        pointerEvents,
        transformStyle: 'preserve-3d',
      }}
      className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-[0_24px_60px_-15px_rgba(15,74,47,0.22)] overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        {/* Visual Column */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[260px] md:min-h-[420px] overflow-hidden bg-slate-900">
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            priority={index < 2}
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Category / Tag Pill */}
          {card.tag && (
            <div className="absolute top-4 left-4 z-10 px-3.5 py-1 rounded-full bg-[#111827]/85 backdrop-blur-md border border-[#E4B03A]/40 text-[#E4B03A] text-[11px] font-bold uppercase tracking-wider shadow-md">
              {card.tag}
            </div>
          )}

          {/* Index Counter */}
          <div className="absolute bottom-4 left-4 z-10 text-white/90 text-xs font-mono font-semibold bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-sm">
            0{index + 1} / 0{totalCards}
          </div>
        </div>

        {/* Content Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div>
            {card.category && (
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#8D6B1B] block mb-2">
                {card.category}
              </span>
            )}

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-serif leading-tight mb-2">
              {card.title}
            </h3>

            {card.subtitle && (
              <p className="text-xs sm:text-sm font-semibold text-[#1E4D38] uppercase tracking-wider mb-4">
                {card.subtitle}
              </p>
            )}

            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed mb-6 font-normal">
              {card.description}
            </p>

            {card.features && card.features.length > 0 && (
              <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                {card.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#1F2937]">
                    <ShieldCheck className="w-4 h-4 text-[#1E4D38] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-[11px] font-semibold text-[#8D6B1B]">
              National Livestock Showcase
            </span>

            {card.ctaLink && (
              <Link
                href={card.ctaLink}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F4A2F] hover:bg-[#1B6543] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:-translate-y-0.5"
              >
                <span>{card.ctaText || 'Learn More'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ThreeDCardZoomShowcase({
  cards,
  className = '',
  sectionTitle = '3D Livestock Cultural Showcase',
  sectionSubtitle = 'Scroll down to immerse in Nigeria’s elite breeds and living pastoral traditions',
}: {
  cards: ThreeDCardItem[];
  className?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across the tall scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{
        height: `${(cards.length + 1) * 110}vh`,
      }}
    >
      {/* Sticky Fullscreen 3D Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden [perspective:1400px]">
        {/* Background Ambient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#D8EADF]/40 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#FEF3D6]/40 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />

        {/* Ambient Section Header (subtle top HUD) */}
        <div className="absolute top-20 sm:top-24 z-20 text-center px-4 pointer-events-none">
          <span className="text-[11px] font-black uppercase tracking-[0.26em] text-[#8D6B1B] bg-white/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#E4B03A]/30 shadow-xs inline-block mb-2">
            Interactive 3D Experience
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F4A2F] font-serif">
            {sectionTitle}
          </h2>
          <p className="text-xs text-[#6B7280] hidden sm:block mt-1">
            {sectionSubtitle}
          </p>
        </div>

        {/* 3D Stack Deck */}
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
          {cards.map((card, idx) => (
            <ThreeDCard
              key={card.id || idx}
              card={card}
              index={idx}
              totalCards={cards.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Scroll Progress Indicator Bar at Bottom */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E4D38] bg-white/70 backdrop-blur-sm px-3 py-0.5 rounded-full border border-slate-200">
            Scroll to Navigate 3D Deck
          </span>
          <div className="w-36 h-1 bg-slate-200/80 rounded-full overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
              className="h-full bg-gradient-to-r from-[#1E4D38] to-[#E4B03A]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
