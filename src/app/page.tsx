'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight, Compass, X } from 'lucide-react';

/* ─── 10 Highlight Cards Connecting to All 10 Major Site Pages ─────────── */
interface CardData {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  link: string;
  cta: string;
  pageTitle: string;
  coverBg: string;
  accentColor: string;
}

const cards: CardData[] = [
  {
    id: 'card-1',
    number: '01',
    eyebrow: 'EXHIBITION · CHAMPIONSHIP LIVESTOCK',
    title: 'Elite Breeds & Championship Pavilion',
    body: 'Explore Nigeria’s premier White Fulani bulls, Sokoto Gudali, Azawak Camels, Red Sokoto Goats, Balami Sheep, and high-yield indigenous poultry.',
    image: '/assets/livestock/showcase-spectrum-hero.jpg',
    link: '/livestock',
    cta: 'EXPLORE ALL LIVESTOCK BREEDS',
    pageTitle: 'LIVESTOCK & CHAMPIONSHIP BREEDS',
    coverBg: 'from-[#062412] via-[#0D4020] to-[#031209]',
    accentColor: '#E4B03A',
  },
  {
    id: 'card-2',
    number: '02',
    eyebrow: 'RUNWAY · CULTURAL ARTS & PAGEANTRY',
    title: 'Livestock Cultural Fashion & Pageant',
    body: "Nigeria's first livestock fashion runway where prize cattle and camels are draped in hand-woven Aso-Oke, featuring cultural dancers and the Queen/King NLC Pageant.",
    image: '/assets/attractions/cultural-fashion-runway.jpg',
    link: '/fashion-parade',
    cta: 'EXPLORE CULTURAL FASHION SHOWCASE',
    pageTitle: 'CULTURAL FASHION & PAGEANTRY',
    coverBg: 'from-[#2A2006] via-[#4A380A] to-[#141003]',
    accentColor: '#FBBF24',
  },
  {
    id: 'card-3',
    number: '03',
    eyebrow: 'NAVIGATION · ABUJA NATIONAL GROUNDS',
    title: 'Interactive 3D Venue Map & Zone Guide',
    body: 'Navigate Old Parade Ground, Abuja: Equestrian Durbar Fields, Suya Village, Live Auction Arenas, Exhibition Pavilions, VIP Lounges, and Parking Hubs.',
    image: '/assets/venue-map/old-parade-ground-map-clean.jpg',
    link: '/venue-map',
    cta: 'OPEN INTERACTIVE VENUE MAP',
    pageTitle: 'INTERACTIVE VENUE MAP',
    coverBg: 'from-[#120A3A] via-[#20125C] to-[#0B0624]',
    accentColor: '#A78BFA',
  },
  {
    id: 'card-4',
    number: '04',
    eyebrow: 'ENTERTAINMENT · LIVE STAGE & ARTS',
    title: 'Grand Concerts & 36-State Cultural Festival',
    body: 'Nightly headline music concerts, traditional masquerades, 36-state cultural dance troupes, kids petting zoo, and family entertainment arenas.',
    image: '/assets/home/story-live-concert-stage.jpg',
    link: '/attractions',
    cta: 'VIEW CARNIVAL ATTRACTIONS',
    pageTitle: 'CARNIVAL ATTRACTIONS & STAGES',
    coverBg: 'from-[#0E2014] via-[#1A3824] to-[#08120B]',
    accentColor: '#34D399',
  },
  {
    id: 'card-5',
    number: '05',
    eyebrow: 'DAY 1 · ROYAL CAVALRY & EQUESTRIAN',
    title: 'Royal Horse Cavalry & Durbar Parade',
    body: 'Witness over 200 ceremonial war stallions, traditional Northern horsemen, camel pageantry and royal racing displays in a breathtaking celebration of national heritage.',
    image: '/assets/home/story-equestrian-durbar-parade.jpg',
    link: '/schedule',
    cta: 'VIEW DURBAR SCHEDULE',
    pageTitle: 'ROYAL DURBAR & PROGRAM SCHEDULE',
    coverBg: 'from-[#062412] via-[#0D4020] to-[#031209]',
    accentColor: '#E4B03A',
  },
  {
    id: 'card-6',
    number: '06',
    eyebrow: 'GASTRONOMY · SUYA VILLAGE & FOOD FEST',
    title: 'Open-Flame Suya Village & Artisanal Feast',
    body: "Nigeria's largest outdoor open-flame grilling arena featuring master Suya chefs, artisanal Kilishi, gourmet catfish BBQ, organic spice markets, and family festival dining.",
    image: '/assets/home/story-suya-grill-fire.jpg',
    link: '/attractions#suya-village',
    cta: 'DISCOVER CULINARY VILLAGE',
    pageTitle: 'OPEN-FLAME SUYA VILLAGE',
    coverBg: 'from-[#3A0A0A] via-[#5C1212] to-[#240606]',
    accentColor: '#F87171',
  },
  {
    id: 'card-7',
    number: '07',
    eyebrow: 'TECHNOLOGY · NHESICS REGISTRY',
    title: 'National Herd Health, Security & Traceability',
    body: 'Discover the FGN digital herd management framework: RFID microchip tagging, real-time epidemic monitoring, biometric cattle passports, and ranch security.',
    image: '/assets/home/story-digital-rfid-livestock-tag.jpg',
    link: '/nhesics',
    cta: 'EXPLORE NHESICS SYSTEM',
    pageTitle: 'DIGITAL RFID HERD REGISTRY',
    coverBg: 'from-[#062A28] via-[#0D4845] to-[#031817]',
    accentColor: '#2DD4BF',
  },
  {
    id: 'card-8',
    number: '08',
    eyebrow: 'BROADCAST · MEDIA & GALLERY',
    title: 'Media Gallery, Live Broadcasts & Newsroom',
    body: 'Access official press releases, high-definition photo galleries, video highlights, live stream feeds, and media accreditation resources.',
    image: '/assets/home/story-live-concert-stage.jpg',
    link: '/media',
    cta: 'VISIT MEDIA & GALLERY PAGE',
    pageTitle: 'MEDIA & LIVE BROADCASTS',
    coverBg: 'from-[#0E2014] via-[#1A3824] to-[#08120B]',
    accentColor: '#34D399',
  },
  {
    id: 'card-9',
    number: '09',
    eyebrow: 'ACCREDITATION · VIP & PRESS PASSES',
    title: 'Official Accreditation & Pass Registration',
    body: 'Register for fast-track VIP entrance badges, international delegation clearance, press credentials, and official carnival passes.',
    image: '/assets/home/story-carnival-entrance-gate.jpg',
    link: '/accreditation',
    cta: 'APPLY FOR ACCREDITATION',
    pageTitle: 'OFFICIAL ACCREDITATION',
    coverBg: 'from-[#240A28] via-[#3E1245] to-[#150618]',
    accentColor: '#E879F9',
  },
  {
    id: 'card-10',
    number: '10',
    eyebrow: 'INITIATIVE · RENEWED HOPE VISION',
    title: 'About the Carnival & Agricultural Heritage',
    body: "Learn about the Federal Ministry of Livestock Development's master plan to modernize agribusiness, transform pastoral livelihoods, and drive national growth.",
    image: '/assets/home/story-modern-ranch-pasture.jpg',
    link: '/about',
    cta: 'READ INITIATIVE VISION',
    pageTitle: 'ABOUT THE CARNIVAL VISION',
    coverBg: 'from-[#211904] via-[#3D2E08] to-[#120E02]',
    accentColor: '#FACC15',
  },
];

export default function Home() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);
  const [isFanned, setIsFanned] = useState(false);
  const isFannedRef = useRef(false);
  const [activeFocusedCard, setActiveFocusedCard] = useState<string | null>(null);
  const [mobileCardIndex, setMobileCardIndex] = useState(0);
  const [mobileCardFlipped, setMobileCardFlipped] = useState(false);
  const [useStaticDeck, setUseStaticDeck] = useState(false);

  // Store original fanned positions for cards when in spread state
  const fannedCoordsRef = useRef<
    Record<
      string,
      { x: string | number; y: string | number; z: number; rotationZ: number; scale: number; zIndex: number }
    >
  >({});

  useEffect(() => {
    // Force browser scroll to top on load
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;
    let removeLenisListener: (() => void) | null = null;
    const sceneElement = sceneRef.current;

    const initAnimation = async () => {
      /* Dynamically import GSAP so it remains client-side */
      const gsapMod = await import('gsap');
      const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (isCancelled) return;

      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setUseStaticDeck(prefersReducedMotion);

      // Synchronize Lenis smooth scroll if present
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenisInstance = typeof window !== 'undefined' ? (window as any).__lenisInstance : null;
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true });
        lenisInstance.on('scroll', ScrollTrigger.update);
        removeLenisListener = () => lenisInstance.off?.('scroll', ScrollTrigger.update);
      }

      if (isCancelled) return;

      const Y_OFFSET = isMobile ? 8 : 12;
      const Z_OFFSET = isMobile ? 12 : 16;
      const totalCards = cards.length;

      ctx = gsap.context(() => {
        const sceneEl = sceneElement;
        if (!sceneEl) return;

        /* Center scene elements */
        gsap.set('.scene-element', { xPercent: -50, yPercent: 0 });

          /* ── INITIAL STATE AT SCROLL = 0 (PAGE LOAD) ──
            - Compact dark hero text is visible over the white scene
           - All 10 Cards start OFF-SCREEN BELOW the viewport (y: '110vh')
        */
        gsap.set('#welcome-title', {
          opacity: 1,
          scale: 1,
          z: 0,
          filter: 'blur(0px)',
        });

        gsap.set('#welcome-title h1', { color: '#111827' });
        gsap.set('#welcome-title h1 span', { color: '#8D6B1B' });
        gsap.set('#welcome-title p', { color: '#4B5563' });

        cards.forEach((card) => {
          const cardEl = `#${card.id}`;
          gsap.set(cardEl, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: '110vh',
            z: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 0.88,
            opacity: 0,
            pointerEvents: 'none',
          });

          gsap.set(`${cardEl} .card-inner`, { rotationY: 0 });
          gsap.set(`${cardEl} .card-face`, { opacity: 1, visibility: 'visible', filter: 'blur(0px)' });
        });

        const updateFanState = (ready: boolean) => {
          if (isFannedRef.current === ready) return;
          isFannedRef.current = ready;
          setIsFanned(ready);
          if (!ready) setActiveFocusedCard(null);
        };

        if (prefersReducedMotion) {
          gsap.set('#welcome-title', { clearProps: 'transform,opacity,scale,z,filter' });
          gsap.set(sceneEl, { clearProps: 'backgroundColor' });
          cards.forEach((card) => {
            gsap.set(`#${card.id}`, { clearProps: 'transform,opacity,pointerEvents,zIndex' });
            gsap.set(`#${card.id} .card-inner`, { rotationY: 0 });
          });
          sceneEl.classList.add('scene-ready');
          return;
        }

        /* ── ScrollTrigger Timeline Setup ── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneEl,
            start: 'top top',
            end: `+=${totalCards * 2600 + 4000}`,
            scrub: 2,
            pin: true,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        /* ── STEP 0: CARD 1 RISES FROM BOTTOM OVER HERO TEXT ── */
        tl.to('#card-1', {
          y: 0,
          opacity: 1,
          scale: isMobile ? 1.0 : 1.05,
          pointerEvents: 'auto',
          zIndex: totalCards,
          duration: 2.2,
          ease: 'power2.out',
        }, 0);

        /* Transition the white hero into the dark deck scene as the first card rises. */
        tl.to(sceneEl, {
          backgroundColor: '#030A05',
          duration: 2.2,
          ease: 'power1.inOut',
        }, 0.2);

        tl.to('#welcome-title h1', {
          color: '#F9FAFB',
          duration: 2,
          ease: 'power1.inOut',
        }, 0.2);

        tl.to('#welcome-title h1 span', {
          color: '#E4B03A',
          duration: 2,
          ease: 'power1.inOut',
        }, 0.2);

        tl.to('#welcome-title p', {
          color: '#D1D5DB',
          duration: 2,
          ease: 'power1.inOut',
        }, 0.2);

        tl.to('#welcome-title', {
          opacity: 0.58,
          scale: 1,
          z: -100,
          filter: 'blur(3px)',
          duration: 2,
          ease: 'power1.out',
        }, 0.2);

        // Cards 2 to 10 move up from bottom into their 3D stack position behind Card 1
        cards.slice(1).forEach((card, idx) => {
          const cardIndex = idx + 1;
          const cardEl = `#${card.id}`;
          tl.to(cardEl, {
            y: cardIndex * Y_OFFSET,
            z: -cardIndex * Z_OFFSET,
            scale: isMobile ? 1.0 : 1.05,
            opacity: 1,
            pointerEvents: 'auto',
            zIndex: totalCards - cardIndex,
            duration: 2.2,
            ease: 'power2.out',
          }, 0.2);

          tl.to(`${cardEl} .card-face`, {
            filter: 'blur(5px)',
            duration: 1.5,
          }, 0.5);
        });

        /* ── LOOP SEQUENCE (Cards 0 to N-2) ── */
        for (let i = 0; i < totalCards - 1; i++) {
          const card = cards[i];
          const cardId = `#${card.id}`;
          const innerId = `${cardId} .card-inner`;

          // Flip & Zoom Card i (Top Card lifts, zooms forward to camera, flips 180deg to reveal back face)
          tl.to(
            innerId,
            {
              rotationY: 180,
              duration: 2.5,
              ease: 'power2.inOut',
            },
            `step-${i}`
          );

          tl.to(
            cardId,
            {
              z: isMobile ? 120 : 220,
              scale: isMobile ? 1.03 : 1.25,
              y: -20,
              duration: 2.5,
              ease: 'power2.inOut',
            },
            `step-${i}`
          );

          // Peel Card i off to the side
          tl.to(cardId, {
            x: isMobile ? '70vw' : '60vw',
            y: 80,
            z: 0,
            scale: 0.95,
            rotationZ: 15,
            duration: 2,
            ease: 'power2.in',
          });

          // Return to Stack Bottom & Reset Rotation
          tl.to(cardId, {
            x: 0,
            y: totalCards * Y_OFFSET,
            z: -totalCards * Z_OFFSET - 50,
            rotationZ: 0,
            scale: isMobile ? 1.0 : 1.05,
            zIndex: -1,
            duration: 2,
            ease: 'power2.out',
          });

          tl.to(
            innerId,
            {
              rotationY: 0,
              duration: 1.5,
              ease: 'power1.out',
            },
            '<'
          );

          tl.to(`${cardId} .card-face`, { filter: 'blur(5px)', duration: 1.5, ease: 'power1.out' }, '<');

          // Shift remaining cards forward in the stack
          for (let j = i + 1; j < totalCards; j++) {
            const nextCardId = `#${cards[j].id}`;
            const nextFaces = `${nextCardId} .card-face`;
            const relativePos = j - (i + 1);

            tl.to(
              nextCardId,
              {
                y: relativePos * Y_OFFSET,
                z: -relativePos * Z_OFFSET,
                zIndex: totalCards - relativePos,
                duration: 2,
                ease: 'power2.out',
              },
              '<'
            );

            // Unblur the card moving to position 0
            if (relativePos === 0) {
              tl.to(
                nextFaces,
                {
                  filter: 'blur(0px)',
                  duration: 1.5,
                  ease: 'power1.out',
                },
                '<'
              );
            }
          }
        }

        /* ── FINAL CARD (Card 10): Flip & Focus in Center ── */
        const lastCard = cards[totalCards - 1];
        const lastCardId = `#${lastCard.id}`;
        const lastInnerId = `${lastCardId} .card-inner`;

        tl.to(
          lastInnerId,
          {
            rotationY: 180,
            duration: 2.5,
            ease: 'power2.inOut',
          },
          'last-card-reveal'
        );

        tl.to(`${lastCardId} .card-face`, { filter: 'blur(0px)', duration: 1.5 }, 'last-card-reveal');

        tl.to(
          lastCardId,
          {
            z: isMobile ? 100 : 200,
            scale: isMobile ? 1.03 : 1.25,
            y: 0,
            duration: 2.5,
            ease: 'power2.inOut',
          },
          'last-card-reveal'
        );

        /* ── THE CLIMAX: THE SHUFFLE SPREAD (spreadAll) ── */
        tl.addLabel('spreadAll');

        cards.forEach((card, index) => {
          const cardId = `#${card.id}`;
          const innerId = `${cardId} .card-inner`;

          // Calculate 10-card fan arc positions (Tighter spread on mobile so all cards fit inside screen!)
          const totalSpreadWidth = isMobile ? 64 : 68;
          const stepPercent = totalSpreadWidth / (totalCards - 1);
          const xPosVal = (index - (totalCards - 1) / 2) * stepPercent;
          const xPos = `${xPosVal}vw`;

          const normIndex = (index - (totalCards - 1) / 2) / ((totalCards - 1) / 2);
          const yArcVal = Math.pow(normIndex, 2) * (isMobile ? 18 : 35) - (isMobile ? 5 : 15);
          const rotZVal = normIndex * (isMobile ? 8 : 18);
          const spreadScale = isMobile ? 0.36 : 0.3;
          const spreadZIndex = index + 10;

          fannedCoordsRef.current[card.id] = {
            x: xPos,
            y: yArcVal,
            z: 50,
            rotationZ: rotZVal,
            scale: spreadScale,
            zIndex: spreadZIndex,
          };

          tl.to(
            cardId,
            {
              x: xPos,
              y: yArcVal,
              z: 50,
              rotationZ: rotZVal,
              scale: spreadScale,
              zIndex: spreadZIndex,
              duration: 3,
              ease: 'back.out(1.2)',
            },
            'spreadAll'
          );

          tl.to(
            innerId,
            {
              rotationY: 180,
              duration: 2.5,
              ease: 'power2.out',
            },
            'spreadAll'
          );
          tl.to(`${cardId} .card-face`, { filter: 'blur(0px)', duration: 2.5 }, 'spreadAll');
        });

        tl.eventCallback('onUpdate', () => updateFanState(tl.progress() >= 0.999));
        tl.eventCallback('onComplete', () => updateFanState(true));
        tl.eventCallback('onReverseComplete', () => updateFanState(false));

        sceneEl.classList.add('scene-ready');
        ScrollTrigger.refresh();
      }, containerRef);
    };

    initAnimation();

    return () => {
      isCancelled = true;
      removeLenisListener?.();
      ctx?.revert();
      sceneElement?.classList.remove('scene-ready');
    };
  }, []);

  const getCardZoomPose = (cardId: string, preferredScale: number) => {
    const cardElement = document.getElementById(cardId);
    if (!cardElement) return { scale: 1, y: 0 };

    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 64;
    const availableHeight = window.innerHeight - headerHeight - 40;
    const availableWidth = window.innerWidth - 32;
    const scale = Math.max(
      0.6,
      Math.min(preferredScale, availableHeight / cardElement.offsetHeight, availableWidth / cardElement.offsetWidth)
    );
    const y = Math.max(0, headerHeight + 20 + (scale * cardElement.offsetHeight - window.innerHeight) / 2);

    return { scale, y };
  };

  const navigateToCardPage = async (card: CardData) => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const duration = reducedMotion ? 0.12 : 1.35;
    const zoomPose = getCardZoomPose(card.id, isMobile ? 1.12 : 1.42);
    const gsapMod = await import('gsap');
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => router.push(card.link),
    });

    timeline.to(`#${card.id}`, {
      x: 0,
      y: zoomPose.y,
      z: 320,
      rotationZ: 0,
      scale: zoomPose.scale,
      zIndex: 1000,
      duration,
    });
    timeline.to(
      sceneRef.current,
      { opacity: 0, duration: reducedMotion ? 0.12 : 0.45, ease: 'power2.in' },
      '-=0.25'
    );
  };

  /* ── Interactive Click / Depth of Field Handling ── */
  const handleCardClick = async (cardId: string) => {
    if (!isFanned) return;

    const gsapMod = await import('gsap');
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (activeFocusedCard === cardId) {
      const orig = fannedCoordsRef.current[cardId];
      if (orig) {
        gsap.to(`#${cardId}`, {
          x: orig.x,
          y: orig.y,
          z: orig.z,
          rotationZ: orig.rotationZ,
          scale: orig.scale,
          zIndex: orig.zIndex,
          duration: 0.9,
          ease: 'power3.out',
        });
      }

      cards.forEach((c) => {
        gsap.to(`#${c.id} .card-face`, {
          filter: 'blur(0px)',
          duration: 0.8,
        });
      });

      setActiveFocusedCard(null);
    } else {
      if (activeFocusedCard && fannedCoordsRef.current[activeFocusedCard]) {
        const prevOrig = fannedCoordsRef.current[activeFocusedCard];
        gsap.to(`#${activeFocusedCard}`, {
          x: prevOrig.x,
          y: prevOrig.y,
          z: prevOrig.z,
          rotationZ: prevOrig.rotationZ,
          scale: prevOrig.scale,
          zIndex: prevOrig.zIndex,
          duration: 0.5,
          ease: 'power2.out',
        });
      }

      const zoomPose = getCardZoomPose(cardId, isMobile ? 1.08 : 1.28);
      gsap.to(`#${cardId}`, {
        x: 0,
        y: zoomPose.y,
        z: 180,
        rotationZ: 0,
        scale: zoomPose.scale,
        zIndex: 200,
          duration: 1.05,
        ease: 'power3.out',
      });

      cards.forEach((c) => {
        if (c.id === cardId) {
          gsap.to(`#${c.id} .card-face`, {
            filter: 'blur(0px)',
            duration: 0.8,
          });
        } else {
          gsap.to(`#${c.id} .card-face`, {
            filter: 'blur(12px)',
            duration: 0.8,
          });
        }
      });

      setActiveFocusedCard(cardId);
    }
  };

  const dismissFocus = async () => {
    if (!activeFocusedCard) return;

    const gsapMod = await import('gsap');
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;

    const orig = fannedCoordsRef.current[activeFocusedCard];
    if (orig) {
      gsap.to(`#${activeFocusedCard}`, {
        x: orig.x,
        y: orig.y,
        z: orig.z,
        rotationZ: orig.rotationZ,
        scale: orig.scale,
        zIndex: orig.zIndex,
        duration: 0.9,
        ease: 'power3.out',
      });
    }

    cards.forEach((c) => {
      gsap.to(`#${c.id} .card-face`, {
        filter: 'blur(0px)',
        duration: 0.8,
      });
    });

    setActiveFocusedCard(null);
  };

  return (
    <div ref={containerRef} className="w-full bg-[#030A05] text-white overflow-x-hidden select-none">
      {/* ═══════════════ 3D PINNED DECK SCENE ═══════════════ */}
      <div
        id="scene-container"
        ref={sceneRef}
        className="w-full h-[100dvh] min-h-[550px] relative bg-[#030A05] overflow-hidden transition-colors"
        onClick={(e) => {
          if (
            activeFocusedCard &&
            e.target instanceof HTMLElement &&
            !e.target.closest('.deck-card')
          ) {
            dismissFocus();
          }
        }}
      >
        {/* Particle Glow Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
          {[...Array(30)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-[#E4B03A]/30 blur-[1px]"
              style={{
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                top: `${(i * 17) % 100}%`,
                left: `${(i * 23) % 100}%`,
              }}
            />
          ))}
        </div>

        {/* Ambient Radial Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(228,176,58,0.12)_0%,transparent_75%)] pointer-events-none z-0" />

        {/* ── HERO TEXT (Top-anchored so logo emblem is 100% visible below sticky header) ── */}
        <div
          id="welcome-title"
          className="scene-element !top-0 !left-1/2 -translate-x-1/2 w-[95vw] max-w-5xl text-center z-0 px-3 sm:px-4 pt-20 sm:pt-24 md:pt-28"
        >
          <div className="hero-intro-item relative w-28 h-16 sm:w-40 sm:h-24 md:w-48 md:h-28 mx-auto mb-3">
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
          <div className="hero-intro-item flex items-center justify-center gap-2 sm:gap-3 mb-3">
            <span className="w-6 sm:w-12 h-px bg-[#8D6B1B]/70" />
            <span className="font-extrabold uppercase text-[9px] sm:text-xs tracking-[0.22em] text-[#8D6B1B]">
              FEDERAL REPUBLIC OF NIGERIA · OFFICIAL CARNIVAL &amp; EXPO
            </span>
            <span className="w-6 sm:w-12 h-px bg-[#8D6B1B]/70" />
          </div>

          {/* Main Headline (Dark on white initially, light on black as cards rise) */}
          <h1 className="hero-intro-item text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#111827] leading-[1.02] tracking-tight mb-3 sm:mb-4">
            RENEWED HOPE <span className="text-[#E4B03A]">NATIONAL LIVESTOCK CARNIVAL</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-intro-item text-xs sm:text-base md:text-lg text-[#4B5563] max-w-4xl mx-auto font-medium leading-relaxed mb-4 sm:mb-6">
            Scroll down to unfold the 10-card deck experience &mdash; exploring Durbar cavalry, championship livestock, Suya village, cultural fashion, digital RFID tagging, and interactive map.
          </p>

          {/* CTAs */}
          <div className="hero-intro-item flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
            <a
              href="https://pass.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3.5 bg-[#E4B03A] hover:bg-[#D4A030] text-[#030A05] text-xs sm:text-sm font-extrabold uppercase tracking-[0.14em] rounded-xl transition-all shadow-button hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Claim Free Gate Pass</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://vendors.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3.5 bg-[#1E4D38] hover:bg-[#256147] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] rounded-xl border border-[#B8D8C5]/30 transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center"
            >
              Exhibitor Booths
            </a>
            <Link
              href="/venue-map"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3.5 bg-[#1E4D38] hover:bg-[#256147] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] rounded-xl border border-[#B8D8C5]/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#E4B03A]" />
              <span>Interactive Map</span>
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="hero-intro-item mt-6 sm:mt-8 flex flex-col items-center gap-1.5 animate-pulse">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[#8D6B1B]/90">
              Scroll Down to Flip Deck
            </span>
            <div className="w-3.5 sm:w-4 h-6 sm:h-7 rounded-full border-2 border-[#E4B03A]/50 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-[#E4B03A]" />
            </div>
          </div>
        </div>

        {/* ── THE 3D DECK CONTAINER ── */}
        <div
          id="deck-container"
          data-static-deck={useStaticDeck}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          {cards.map((card) => (
            <div
              key={card.id}
              id={card.id}
              /*
                EXPANSIVE CANVAS CARD DIMENSIONS:
                Portrait cards on mobile; landscape cards on desktop.
              */
              className="deck-card w-[76vw] max-w-[320px] aspect-[9/16] md:w-[82vw] md:max-w-[920px] md:aspect-video lg:w-[84vw] lg:max-w-[1040px] pointer-events-auto"
              data-mobile-active={mobileCardIndex === Number(card.number) - 1}
              onClick={() => {
                if (useStaticDeck) {
                  setMobileCardFlipped((flipped) => !flipped);
                  return;
                }
                handleCardClick(card.id);
              }}
            >
              <div className="card-inner" data-mobile-flipped={mobileCardFlipped}>
                {/* ════ FRONT COVER (Face Down State) ════ */}
                <div
                  className={`card-face card-face-front bg-gradient-to-br ${card.coverBg} border-2 border-[#E4B03A]/45 shadow-2xl flex flex-col justify-between p-3 sm:p-8 md:p-10 text-white relative rounded-[1.5rem]`}
                >
                  {/* Decorative Pattern Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none rounded-[1.5rem]" />

                  {/* Center Official Site Logo & Page Title */}
                  <div className="flex-1 flex flex-col items-center justify-center relative z-10 my-auto text-center">
                    <div className="relative w-24 h-16 sm:w-48 sm:h-32 md:w-56 md:h-36 mb-2 sm:mb-4">
                      <Image
                        src="/assets/branding/carnival-logo-transparent.png"
                        alt="National Livestock Carnival Logo"
                        fill
                        sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, 224px"
                        className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.7)]"
                      />
                    </div>
                    <span
                      className="font-black text-xs sm:text-lg md:text-xl tracking-[0.1em] sm:tracking-[0.22em] uppercase max-w-[360px] leading-tight"
                      style={{ color: card.accentColor }}
                    >
                      {card.pageTitle}
                    </span>
                  </div>

                  {/* Clean Cover Footer */}
                  <div className="border-t border-white/15 pt-3 sm:pt-4 flex items-center justify-center relative z-10">
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.22em] text-white/90">
                      LIVESTOCK CARNIVAL 2026
                    </span>
                  </div>
                </div>

                {/* ════ REVEALED CONTENT (Face Up State - Matching User Reference Screenshots) ════ */}
                <div
                  className="card-face card-face-back bg-[#08150B] border-2 border-[#E4B03A]/45 shadow-[0_35px_100px_-15px_rgba(0,0,0,0.95)] flex flex-col justify-between rounded-[1.5rem]"
                >
                  {/* Top Image Banner Section (52% height) */}
                  <div className="relative w-full h-[52%] rounded-t-[1.5rem] shrink-0">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover object-center rounded-t-[1.5rem]"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 1000px, 1280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08150B] via-[#08150B]/25 to-transparent rounded-t-[1.5rem]" />

                    {/* Floating Pill Eyebrow Badge on top left of image */}
                    <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#E4B03A] bg-[#0A1A10]/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#E4B03A]/40 shadow-md">
                        {card.eyebrow}
                      </span>
                      {activeFocusedCard === card.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissFocus();
                          }}
                          className="p-1.5 rounded-full bg-[#030A05]/90 text-white hover:text-[#E4B03A] border border-white/20 transition-colors"
                          title="Close full view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom Dark Content Panel (48% height) */}
                  <div className="p-5 sm:p-7 md:p-10 bg-[#08150B] flex-1 flex flex-col justify-between rounded-b-[1.5rem]">
                    <div>
                      <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-2 sm:mb-3">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-base md:text-lg text-gray-300/90 leading-relaxed max-w-4xl mb-4 sm:mb-6">
                        {card.body}
                      </p>
                    </div>

                    <div className="pt-2 sm:pt-0">
                      <Link
                        href={card.link}
                        className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#E4B03A] hover:bg-[#D4A030] text-[#0A1A10] text-xs sm:text-sm font-extrabold uppercase tracking-[0.14em] sm:tracking-[0.16em] shadow-button hover:shadow-[0_12px_30px_rgba(212,175,55,0.4)] transition-all hover:-translate-y-0.5 group"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          navigateToCardPage(card);
                        }}
                      >
                        <span>{card.cta}</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav className="mobile-deck-controls" aria-label="Carnival highlights">
          <button
            type="button"
            aria-label="Previous highlight"
            onClick={() => {
              setMobileCardIndex((index) => Math.max(0, index - 1));
              setMobileCardFlipped(false);
            }}
            disabled={mobileCardIndex === 0}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <span aria-live="polite">
            {String(mobileCardIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            aria-label="Next highlight"
            onClick={() => {
              setMobileCardIndex((index) => Math.min(cards.length - 1, index + 1));
              setMobileCardFlipped(false);
            }}
            disabled={mobileCardIndex === cards.length - 1}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </nav>
      </div>

      {/* ═══════════════ EDITORIAL CLOSING SECTION ═══════════════ */}
      <section className="w-full py-20 sm:py-24 bg-[#08150B] text-white relative overflow-hidden border-t border-[#E4B03A]/30">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E4B03A]/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(228,176,58,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 text-center z-10 flex flex-col items-center">
          <span className="font-extrabold uppercase mb-4 inline-flex items-center gap-3 text-xs tracking-[0.26em] text-[#E4B03A]">
            <span className="w-8 h-px bg-[#E4B03A]/60" />
            21 – 23 NOVEMBER 2026 · ABUJA NATIONAL GROUNDS
            <span className="w-8 h-px bg-[#E4B03A]/60" />
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mb-5 tracking-tight">
            Join the Grand Celebration of Culture, Agribusiness &amp; Heritage
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mb-8 leading-relaxed">
            Complimentary gate passes are available for all delegates, visitors, and families. Secure your passes and explore vendor booth bookings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="https://pass.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#E4B03A] hover:bg-[#D4A030] text-[#030A05] text-xs sm:text-sm font-extrabold uppercase tracking-[0.16em] rounded-xl transition-all shadow-button hover:-translate-y-0.5"
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
              className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/12 text-gray-200 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] rounded-xl border border-white/12 transition-all hover:-translate-y-0.5"
            >
              View 3-Day Program
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
