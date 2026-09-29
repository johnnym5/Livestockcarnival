'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

/* ─── 10 Highlight Cards Connecting to All Major Site Pages ─────────── */
const cards = [
  {
    id: 'card-1',
    eyebrow: 'DAY 1 · ROYAL CAVALRY & EQUESTRIAN',
    title: 'Royal Horse Cavalry & Durbar Parade',
    body: 'Witness over 200 ceremonial war stallions, traditional Northern horsemen, camel pageantry and royal racing displays in a breathtaking celebration of national heritage.',
    image: '/assets/home/story-equestrian-durbar-parade.jpg',
    link: '/schedule',
    cta: 'View Durbar Schedule',
  },
  {
    id: 'card-2',
    eyebrow: 'EXHIBITION · CHAMPIONSHIP LIVESTOCK',
    title: 'Elite Breeds & Championship Pavilion',
    body: 'Explore Nigeria’s premier White Fulani bulls, Sokoto Gudali, Azawak Camels, Red Sokoto Goats, Balami Sheep, and high-yield indigenous poultry.',
    image: '/assets/livestock/showcase-spectrum-hero.jpg',
    link: '/livestock',
    cta: 'Explore All Livestock Breeds',
  },
  {
    id: 'card-3',
    eyebrow: 'GASTRONOMY · SUYA VILLAGE & FOOD FEST',
    title: 'Open-Flame Suya Village & Artisanal Feast',
    body: "Nigeria's largest outdoor open-flame grilling arena featuring master Suya chefs, artisanal Kilishi, gourmet catfish BBQ, organic spice markets, and family festival dining.",
    image: '/assets/home/story-suya-grill-fire.jpg',
    link: '/attractions#suya-village',
    cta: 'Discover Culinary Village',
  },
  {
    id: 'card-4',
    eyebrow: 'RUNWAY · CULTURAL ARTS & PAGEANTRY',
    title: 'Livestock Cultural Fashion & Pageant',
    body: "Nigeria's first livestock fashion runway where prize cattle and camels are draped in hand-woven Aso-Oke, featuring cultural dancers and the Queen/King NLC Pageant.",
    image: '/assets/attractions/cultural-fashion-runway.jpg',
    link: '/fashion-parade',
    cta: 'Explore Cultural Fashion Showcase',
  },
  {
    id: 'card-5',
    eyebrow: 'TECHNOLOGY · NHESICS REGISTRY',
    title: 'National Herd Health, Security & Traceability',
    body: 'Discover the FGN digital herd management framework: RFID microchip tagging, real-time epidemic monitoring, biometric cattle passports, and ranch security.',
    image: '/assets/home/story-digital-rfid-livestock-tag.jpg',
    link: '/nhesics',
    cta: 'Explore NHESICS System',
  },
  {
    id: 'card-6',
    eyebrow: 'NAVIGATION · ABUJA NATIONAL GROUNDS',
    title: 'Interactive 3D Venue Map & Zone Guide',
    body: 'Navigate Old Parade Ground, Abuja: Equestrian Durbar Fields, Suya Village, Live Auction Arenas, Exhibition Pavilions, VIP Lounges, and Parking Hubs.',
    image: '/assets/venue-map/old-parade-ground-map-annotated.jpg',
    link: '/venue-map',
    cta: 'Open Interactive Venue Map',
  },
  {
    id: 'card-7',
    eyebrow: 'ENTERTAINMENT · LIVE STAGE & ARTS',
    title: 'Grand Concerts & 36-State Cultural Festival',
    body: 'Nightly headline music concerts, traditional masquerades, 36-state cultural dance troupes, kids petting zoo, and family entertainment arenas.',
    image: '/assets/home/story-live-concert-stage.jpg',
    link: '/attractions',
    cta: 'View Carnival Attractions',
  },
  {
    id: 'card-8',
    eyebrow: 'COMMERCIAL · TRADING & LIVE AUCTION',
    title: 'Live Auction & Commercial Bidding',
    body: 'Precision live-weight trading, certified digital scales, transparent farm-gate pricing, seedstock auctions, and B2B agribusiness matchmaking.',
    image: '/assets/home/story-etagging-veterinary.jpg',
    link: '/schedule',
    cta: 'View Bidding & Trading Schedule',
  },
  {
    id: 'card-9',
    eyebrow: 'ACCREDITATION · VIP & PRESS PASSES',
    title: 'Official Accreditation & Pass Registration',
    body: 'Register for fast-track VIP entrance badges, international delegation clearance, press credentials, and official carnival passes.',
    image: '/assets/home/story-carnival-entrance-gate.jpg',
    link: '/accreditation',
    cta: 'Apply For Accreditation',
  },
  {
    id: 'card-10',
    eyebrow: 'INITIATIVE · RENEWED HOPE VISION',
    title: 'About the Carnival & Agricultural Heritage',
    body: "Learn about the Federal Ministry of Livestock Development's master plan to modernize agribusiness, transform pastoral livelihoods, and drive national growth.",
    image: '/assets/home/story-modern-ranch-pasture.jpg',
    link: '/about',
    cta: 'Read Initiative Vision',
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    const initAnimation = async () => {
      /* Dynamically import GSAP so it stays client-only */
      const gsapMod = await import('gsap');
      const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (isCancelled) return;

      // Synchronize Lenis with GSAP ScrollTrigger if present
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenisInstance = typeof window !== 'undefined' ? (window as any).__lenisInstance : null;
      if (lenisInstance) {
        lenisInstance.on('scroll', ScrollTrigger.update);
      }

      if (isCancelled) return;

      const isMobile = window.innerWidth < 768;

      /* Use gsap.context scoped to outer container so all selectors are found */
      ctx = gsap.context(() => {
        const sceneEl = sceneRef.current;
        if (!sceneEl) return;

        /* ── Center all scene elements ───────────────────────────────── */
        gsap.set('.scene-element', { xPercent: -50, yPercent: -50 });

        const cardSelectors = cards.map((c) => `#${c.id}`).join(', ');

        /* ── Initial states: Welcome Title is visible at top; Cards are hidden at bottom ── */
        gsap.set('#welcome-title', { opacity: 1, scale: 1, y: 0, z: 0, filter: 'none' });
        gsap.set(cardSelectors, {
          x: 0,
          y: '100vh',
          scale: 0.85,
          opacity: 0,
          z: isMobile ? 0 : -150,
          filter: isMobile ? 'none' : 'blur(10px)',
          pointerEvents: 'none',
        });

        /* ── Slow, Smooth Master Scroll Timeline across all 10 highlight cards ────── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneEl,
            start: 'top top',
            end: isMobile ? `+=${cards.length * 1400}` : `+=${cards.length * 1700}`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        const maxZoomScale = isMobile ? 3.2 : 32;
        const blurOut = isMobile ? 'none' : 'blur(32px)';
        const blurTitleOut = isMobile ? 'none' : 'blur(16px)';
        const blurFocus = isMobile ? 'none' : 'blur(0px)';

        /* Phase 1: Welcome title starts at 100% opacity on load and floats up as user scrolls down */
        tl.fromTo(
          '#welcome-title',
          { opacity: 1, y: 0, scale: 1, filter: 'none' },
          { y: '-45vh', opacity: 0, filter: blurTitleOut, duration: 2.5, ease: 'power2.inOut' },
          0
        );

        /* Phase 2: Sequence through each card with entry, focal reading hold, and zoom transition */
        cards.forEach((card, index) => {
          const cardId = `#${card.id}`;
          const startTime = 0.8 + index * 4.8;

          tl.to(
            cardId,
            {
              y: 0,
              scale: 0.98,
              opacity: 1,
              filter: blurFocus,
              pointerEvents: 'auto',
              duration: 2.5,
              ease: 'power2.out',
            },
            startTime
          ).to(cardId, {
            scale: 1.02,
            z: isMobile ? 40 : 100,
            duration: 2.2,
            ease: 'none',
          });

          if (index < cards.length - 1) {
            tl.to(cardId, {
              scale: maxZoomScale,
              opacity: 0,
              filter: blurOut,
              pointerEvents: 'none',
              duration: 2.2,
              ease: 'power3.in',
            });
          } else {
            tl.to(cardId, {
              y: '-100vh',
              opacity: 0,
              filter: isMobile ? 'none' : 'blur(20px)',
              pointerEvents: 'none',
              duration: 2.2,
              ease: 'power2.in',
            });
          }
        });

        ScrollTrigger.refresh();
      }, containerRef);
    };

    initAnimation();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#0A1A10] text-white overflow-x-hidden">
      {/* ═══════════════ 3D DEEP-DIVE SCENE ═══════════════ */}
      <div
        id="scene-container"
        ref={sceneRef}
        className="w-full h-[100dvh] min-h-[520px] relative bg-[#0A1A10] overflow-hidden"
      >
        {/* Ambient particle dots */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(30)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-[#E4B03A]/25"
              style={{
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                top: `${(i * 17) % 100}%`,
                left: `${(i * 23) % 100}%`,
              }}
            />
          ))}
        </div>

        {/* Radial ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(228,176,58,0.08)_0%,transparent_70%)] pointer-events-none z-0" />

        {/* ── WELCOME TITLE ── */}
        <div id="welcome-title" className="scene-element w-[92vw] max-w-4xl text-center z-10 px-3 sm:px-4">
          {/* Logo */}
          <div className="relative w-28 h-16 sm:w-40 sm:h-24 md:w-48 md:h-28 mx-auto mb-2 sm:mb-4">
            <Image
              src="/assets/branding/carnival-logo-transparent.png"
              alt="Livestock Carnival Emblem"
              fill
              priority
              sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, 192px"
              className="object-contain drop-shadow-[0_12px_30px_rgba(228,176,58,0.4)]"
            />
          </div>

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
            <span className="w-4 sm:w-8 h-px bg-[#E4B03A]/70" />
            <span
              className="font-extrabold uppercase text-[9px] sm:text-xs tracking-[0.16em] sm:tracking-[0.24em]"
              style={{ color: '#D4AF37' }}
            >
              FEDERAL REPUBLIC OF NIGERIA · OFFICIAL CARNIVAL &amp; EXPO
            </span>
            <span className="w-4 sm:w-8 h-px bg-[#E4B03A]/70" />
          </div>

          {/* Headline */}
          <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-2 sm:mb-4">
            Welcome to the{' '}
            <span className="text-[#E4B03A]">RENEWED HOPE</span>{' '}
            NATIONAL LIVESTOCK CARNIVAL 2026
          </h1>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-base md:text-lg text-gray-300/90 font-normal leading-normal sm:leading-relaxed max-w-2xl mx-auto mb-4 sm:mb-8">
            Experience Nigeria&apos;s grandest celebration of culture, music, food, and farming
            &mdash; featuring royal horses, camels, championship cattle, open-flame suya, and live concerts.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
            <a
              href="https://pass.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-7 py-2.5 sm:py-3.5 bg-[#E4B03A] hover:bg-[#D4A030] text-[#0A1A10] text-xs sm:text-sm font-extrabold uppercase tracking-[0.14em] sm:tracking-[0.16em] rounded-xl transition-all shadow-button hover:shadow-[0_16px_40px_-4px_rgba(228,176,58,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Claim Free Gate Pass</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://vendors.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-7 py-2.5 sm:py-3.5 bg-[#1E4D38] hover:bg-[#256147] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] rounded-xl border border-[#B8D8C5]/30 transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center"
            >
              Exhibitor Booths
            </a>
            <Link
              href="/venue-map"
              className="w-full sm:w-auto px-6 sm:px-7 py-2.5 sm:py-3.5 bg-white/10 hover:bg-white/18 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] rounded-xl backdrop-blur-sm border border-white/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#E4B03A]" />
              <span>Interactive Map</span>
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="mt-4 sm:mt-10 flex flex-col items-center gap-1 sm:gap-1.5 animate-pulse">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.26em] text-[#E4B03A]/70">
              Scroll Down to Dive In
            </span>
            <div className="w-3.5 sm:w-4 h-6 sm:h-7 rounded-full border-2 border-[#E4B03A]/40 flex items-start justify-center p-1">
              <div className="w-1 h-1.5 sm:h-2 rounded-full bg-[#E4B03A]" />
            </div>
          </div>
        </div>

        {/* ── 10 HIGHLIGHT CARDS (Connecting to all major pages) ── */}
        {cards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className="scene-element z-20 w-[90vw] max-w-2xl opacity-0 pointer-events-none"
          >
            <GlassCard card={card} />
          </div>
        ))}
      </div>

      {/* ═══════════════ EDITORIAL CLOSING BANNER (Natural Reveal) ═══════════════ */}
      <section className="w-full py-20 sm:py-24 bg-[#0F2A1A] text-white relative overflow-hidden border-t border-[#E4B03A]/30">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E4B03A]/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(228,176,58,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#1E4D38]/40 blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 text-center z-10 flex flex-col items-center">
          <span
            className="font-extrabold uppercase mb-4 inline-flex items-center gap-3 text-xs"
            style={{ letterSpacing: '0.28em', color: '#E4B03A' }}
          >
            <span className="w-8 h-px bg-[#E4B03A]/60" />
            21 – 23 NOVEMBER 2026 · ABUJA NATIONAL GROUNDS
            <span className="w-8 h-px bg-[#E4B03A]/60" />
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mb-5 tracking-tight">
            Join the Celebration of Heritage, Culture &amp; Agribusiness
          </h2>

          <p className="text-sm sm:text-base text-[#D8EADF] max-w-2xl mb-8 leading-relaxed">
            Admission to public grounds, Durbar viewing arenas, livestock pavilions, and cultural villages is complimentary for all registered citizens and delegates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="https://pass.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#E4B03A] hover:bg-[#D4A030] text-[#0A1A10] text-xs sm:text-sm font-extrabold uppercase tracking-[0.16em] rounded-xl transition-all shadow-button hover:shadow-[0_16px_40px_-4px_rgba(228,176,58,0.5)] hover:-translate-y-0.5"
            >
              Claim Free Gate Pass &rarr;
            </a>
            <a
              href="https://vendors.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/10 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.16em] rounded-xl border border-white/25 transition-all hover:-translate-y-0.5"
            >
              Exhibitor &amp; Vendor Booking
            </a>
            <Link
              href="/schedule"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/12 text-[#D8EADF] text-xs sm:text-sm font-bold uppercase tracking-[0.16em] rounded-xl border border-white/12 transition-all hover:-translate-y-0.5"
            >
              View 3-Day Program
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Glassmorphism Card Component                                         */
/* ═══════════════════════════════════════════════════════════════════════ */

interface CardData {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  link: string;
  cta: string;
}

function GlassCard({ card }: { card: CardData }) {
  return (
    <div className="glass-card overflow-hidden w-full max-w-xl md:max-w-2xl mx-auto shadow-2xl">
      {/* Image */}
      <div className="relative w-full h-36 sm:h-52 md:h-60 overflow-hidden rounded-t-[1.5rem]">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 90vw, 700px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A10] via-[#0A1A10]/40 to-transparent" />
        <div className="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-4 right-3 sm:right-4">
          <span className="text-[9px] sm:text-xs font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#E4B03A] bg-[#0A1A10]/85 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#E4B03A]/25">
            {card.eyebrow}
          </span>
        </div>
      </div>

      {/* Text content */}
      <div className="p-4 sm:p-7 md:p-8 bg-[#0A1A10]/85">
        <h3 className="text-base sm:text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight mb-2 sm:mb-2.5">
          {card.title}
        </h3>
        <p className="text-[11px] sm:text-sm md:text-base text-gray-300/90 leading-normal sm:leading-relaxed mb-3 sm:mb-5">
          {card.body}
        </p>
        <Link
          href={card.link}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-extrabold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#E4B03A] hover:text-white group transition-colors"
        >
          <span>{card.cta}</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
