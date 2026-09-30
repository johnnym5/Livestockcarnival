'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
  const touchStartRef = useRef<{ x: number; y: number; cardId: string } | null>(null);
  const suppressCardClickRef = useRef(false);
  const scrollTriggerRef = useRef<{ disable: (revert?: boolean) => void; enable: () => void } | null>(null);

  // Store original fanned positions for cards when in spread state
  const fannedCoordsRef = useRef<
    Record<
      string,
      { x: string | number; y: string | number; z: number; rotationZ: number; scale: number; zIndex: number }
    >
  >({});

  const isMobileViewport = () => window.matchMedia('(max-width: 767px)').matches;

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

      const Y_OFFSET = isMobile ? 2 : 3;
      const Z_OFFSET = isMobile ? 3 : 4;
      const totalCards = cards.length;

      ctx = gsap.context(() => {
        const sceneEl = sceneElement;
        if (!sceneEl) return;

        /* Center scene elements */
        gsap.set('.scene-element', { xPercent: -50, yPercent: 0 });

        /* Hero title setup with clean high-contrast colors */
        gsap.set('#welcome-title', {
          opacity: 1,
          scale: 1,
          z: 0,
          filter: 'none',
          transformOrigin: '50% 50%',
          zIndex: 0,
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
            opacity: 1,
            pointerEvents: 'none',
          });

          gsap.set(`${cardEl} .card-inner`, { rotationX: 0, rotationY: 0 });
          gsap.set(`${cardEl} .card-face`, { opacity: 1, visibility: 'visible', filter: 'none' });
        });

        const updateFanState = (ready: boolean) => {
          if (isFannedRef.current === ready) return;
          isFannedRef.current = ready;
          setIsFanned(ready);
          if (!ready) setActiveFocusedCard(null);
        };

        if (prefersReducedMotion) {
          gsap.set('#welcome-title', { xPercent: -50, clearProps: 'opacity,scale,z,filter' });
          gsap.set(sceneEl, { clearProps: 'backgroundColor' });
          cards.forEach((card) => {
            gsap.set(`#${card.id}`, { clearProps: 'transform,opacity,pointerEvents,zIndex' });
            gsap.set(`#${card.id} .card-inner`, { rotationX: 0 });
          });
          sceneEl.classList.add('scene-ready');
          return;
        }

        /* ── ScrollTrigger Timeline Setup (60FPS Hardware Accelerated) ── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneEl,
            start: 'top top',
            end: `+=${isMobile ? totalCards * 700 + 1300 : totalCards * 800 + 1600}`,
            scrub: isMobile ? 0.25 : 0.35,
            pin: true,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        const backdropLayers = gsap.utils.toArray<HTMLElement>('.deck-backdrop-image');
        const backdropShade = sceneEl.querySelector<HTMLElement>('.deck-backdrop-shade');
        const sceneDarkenAt = 0.25;
        const sceneDarkenDuration = 2.2;
        gsap.set(backdropLayers, { opacity: 0, scale: 1.08, visibility: 'hidden' });
        if (backdropShade) gsap.set(backdropShade, { opacity: 0 });
        if (backdropShade) {
          tl.to(backdropShade, {
            opacity: 1,
            duration: sceneDarkenDuration,
            ease: 'sine.inOut',
          }, sceneDarkenAt);
        }
        if (backdropLayers[0]) {
          tl.set(backdropLayers[0], { visibility: 'visible' }, 0);
          tl.to(backdropLayers[0], {
            opacity: 0.52,
            duration: sceneDarkenDuration,
            ease: 'sine.inOut',
          }, sceneDarkenAt);
          tl.to(backdropLayers[0], { scale: 1.16, duration: 12, ease: 'none' }, sceneDarkenAt);
        }

        /* ── STEP 0: CARD 1 RISES FROM BOTTOM OVER HERO TEXT ── */
        // Explicitly guarantee Card 1 starts at rotationX: 0 (front cover) when at top of page
        tl.to('#card-1', {
          rotationX: 0,
          rotationY: 0,
          duration: 0.1,
        }, 0);

        tl.to('#card-1', {
          y: 0,
          scale: isMobile ? 1.0 : 1.05,
          pointerEvents: 'auto',
          zIndex: totalCards,
          duration: 2.2,
          ease: 'power2.out',
        }, 0);

        // Recede the hero from the first instant of the card entrance.
        tl.to('#welcome-title', {
          opacity: 0.04,
          scale: isMobile ? 0.48 : 0.56,
          z: -120,
          filter: 'blur(1.25px)',
          duration: 1.6,
          ease: 'power1.inOut',
        }, 0);

        const pinSpacer = sceneEl.parentElement;
        tl.to([sceneEl, pinSpacer], {
          backgroundColor: '#030A05',
          duration: sceneDarkenDuration,
          ease: 'sine.inOut',
        }, sceneDarkenAt);
        tl.to('#welcome-title h1', {
          color: '#F9FAFB',
          duration: sceneDarkenDuration,
          ease: 'sine.inOut',
        }, sceneDarkenAt);
        tl.to('#welcome-title h1 span', {
          color: '#E4B03A',
          duration: sceneDarkenDuration,
          ease: 'sine.inOut',
        }, sceneDarkenAt);
        tl.to('#welcome-title p', {
          color: '#D1D5DB',
          duration: sceneDarkenDuration,
          ease: 'sine.inOut',
        }, sceneDarkenAt);

        const cardSequenceStart = 2.8;
        const cardStepDuration = 2.9;
        tl.addLabel('step-0', cardSequenceStart);

        const revealPoses = [
          { origin: '50% 50%', rotationX: 164, rotationY: -4, x: -4 },
          { origin: '50% 50%', rotationX: 168, rotationY: 4, x: 4 },
          { origin: '50% 50%', rotationX: 165, rotationY: 3, x: -3 },
          { origin: '50% 50%', rotationX: 167, rotationY: -3, x: 3 },
          { origin: '50% 50%', rotationX: 163, rotationY: 5, x: -4 },
          { origin: '50% 50%', rotationX: 169, rotationY: -4, x: 4 },
          { origin: '50% 50%', rotationX: 165, rotationY: -5, x: -3 },
          { origin: '50% 50%', rotationX: 168, rotationY: 3, x: 3 },
          { origin: '50% 50%', rotationX: 166, rotationY: 4, x: -4 },
          { origin: '50% 50%', rotationX: 164, rotationY: -3, x: 4 },
        ];

        // Cards 2 to 10 move up into a tight, solid stack behind Card 1.
        cards.slice(1).forEach((card, idx) => {
          const cardIndex = idx + 1;
          const cardEl = `#${card.id}`;
          tl.to(cardEl, {
            y: cardIndex * Y_OFFSET,
            z: -cardIndex * Z_OFFSET,
            scale: isMobile ? 1.0 : 1.05,
            pointerEvents: 'auto',
            zIndex: totalCards - cardIndex,
            duration: 2.2,
            ease: 'power2.out',
          }, 0.2);

        });

        /* ── LOOP SEQUENCE (Cards 0 to N-2) ── */
        for (let i = 0; i < totalCards - 1; i++) {
          const card = cards[i];
          const cardId = `#${card.id}`;
          const pose = revealPoses[i % revealPoses.length];
          tl.addLabel(`step-${i}`, cardSequenceStart + i * cardStepDuration);

          if (i > 0) {
            const previousBackdrop = backdropLayers[i - 1];
            const currentBackdrop = backdropLayers[i];
            if (previousBackdrop && currentBackdrop) {
              tl.set(currentBackdrop, { visibility: 'visible' }, `step-${i}`);
              tl.to(previousBackdrop, { opacity: 0, duration: 2.6, ease: 'power1.inOut' }, `step-${i}`);
              tl.set(previousBackdrop, { visibility: 'hidden' }, `step-${i}+=2.6`);
              tl.to(currentBackdrop, { opacity: 0.52, duration: 2.6, ease: 'power1.inOut' }, `step-${i}`);
              tl.to(currentBackdrop, { scale: 1.2, duration: 4.2, ease: 'none' }, `step-${i}`);
            }
          }

          tl.set(cardId, { transformOrigin: pose.origin }, `step-${i}`);

          // Flip & Zoom Card i (Top Card lifts, zooms forward to camera, flips vertically bottom-to-top with 3D pitch foreshortening)
          tl.to(
            cardId,
            {
              rotationX: pose.rotationX,
              rotationY: pose.rotationY,
              rotationZ: 0,
              duration: 0.75,
              ease: 'power2.inOut',
            },
            `step-${i}+=0.45`
          );

          tl.to(
            cardId,
            {
              z: isMobile ? 120 : 220,
              x: pose.x,
              scale: isMobile ? 1.03 : 1.08,
              y: -20,
              duration: 0.3,
              ease: 'power2.inOut',
            },
            `step-${i}`
          );

          tl.to({}, { duration: 0.15 }, `step-${i}+=0.3`);
          tl.to({}, { duration: 0.15 }, `step-${i}+=1.2`);

          // Peel Card i off to the side
          tl.to(cardId, {
            x: isMobile ? '70vw' : '60vw',
            y: 80,
            z: 0,
            scale: 0.95,
            rotationZ: 3,
            duration: 0.65,
            ease: 'power2.in',
          }, `step-${i}+=1.35`);

          // Return to Stack Bottom & Reset Rotation
          tl.to(cardId, {
            x: 0,
            y: totalCards * Y_OFFSET,
            z: -totalCards * Z_OFFSET - 50,
            rotationZ: 0,
            scale: isMobile ? 1.0 : 1.05,
            rotationY: 0,
            zIndex: -1,
            transformOrigin: '50% 50%',
            duration: 0.7,
            ease: 'power2.out',
          }, `step-${i}+=2`);

          tl.to(
            cardId,
            {
              rotationX: 0,
              duration: 0.2,
              ease: 'power1.out',
            },
            '<'
          );

          // Shift remaining cards forward in the stack
          for (let j = i + 1; j < totalCards; j++) {
            const nextCardId = `#${cards[j].id}`;
            const relativePos = j - (i + 1);

            tl.to(
              nextCardId,
              {
                y: relativePos * Y_OFFSET,
                z: -relativePos * Z_OFFSET,
                zIndex: totalCards - relativePos,
                duration: 0.7,
                ease: 'power2.out',
              },
              '<'
            );

          }
        }

        /* ── FINAL CARD (Card 10): Flip & Focus in Center ── */
        const lastCard = cards[totalCards - 1];
        const lastCardId = `#${lastCard.id}`;
        const lastPose = revealPoses[(totalCards - 1) % revealPoses.length];
        const lastCardRevealAt = cardSequenceStart + (totalCards - 1) * cardStepDuration;
        tl.addLabel('last-card-reveal', lastCardRevealAt);
        const previousBackdrop = backdropLayers[totalCards - 2];
        const finalBackdrop = backdropLayers[totalCards - 1];
        if (previousBackdrop && finalBackdrop) {
          tl.set(finalBackdrop, { visibility: 'visible' }, lastCardRevealAt);
          tl.to(previousBackdrop, { opacity: 0, duration: 2.6, ease: 'power1.inOut' }, lastCardRevealAt);
          tl.set(previousBackdrop, { visibility: 'hidden' }, lastCardRevealAt + 2.6);
          tl.to(finalBackdrop, { opacity: 0.52, duration: 2.6, ease: 'power1.inOut' }, lastCardRevealAt);
          tl.to(finalBackdrop, { scale: 1.2, duration: 4.2, ease: 'none' }, lastCardRevealAt);
        }
        tl.set(lastCardId, { transformOrigin: lastPose.origin }, lastCardRevealAt);
        tl.to(
          lastCardId,
          {
            rotationX: lastPose.rotationX,
            rotationY: lastPose.rotationY,
            rotationZ: 0,
            duration: 0.75,
            ease: 'power2.inOut',
          },
          'last-card-reveal+=0.45'
        );

        tl.to(
          lastCardId,
          {
            z: isMobile ? 100 : 200,
            x: lastPose.x,
            scale: isMobile ? 1.03 : 1.08,
            y: 0,
            duration: 0.3,
            ease: 'power2.inOut',
          },
          'last-card-reveal'
        );

        /* ── THE CLIMAX: THE SHUFFLE SPREAD (spreadAll) ── */
        tl.addLabel('spreadAll', 'last-card-reveal+=1.4');

        backdropLayers.forEach((layer) => {
          tl.to(layer, { opacity: 0, duration: 3.5, ease: 'power1.inOut' }, 'spreadAll');
          tl.set(layer, { visibility: 'hidden' }, 'spreadAll+=3.5');
        });
        if (backdropShade) {
          tl.to(backdropShade, { opacity: 0, duration: 3.5, ease: 'power1.inOut' }, 'spreadAll');
        }
        tl.to('#welcome-title', {
          opacity: 0.3,
          scale: isMobile ? 0.68 : 0.74,
          z: -40,
          filter: 'blur(2px)',
          duration: 3.5,
          ease: 'power1.inOut',
        }, 'spreadAll');

        cards.forEach((card, index) => {
          const cardId = `#${card.id}`;

          // Calculate 10-card fan arc positions (Tighter spread on mobile so all cards fit inside screen!)
          const totalSpreadWidth = 68;
          const stepPercent = totalSpreadWidth / (totalCards - 1);
          const xPosVal = (index - (totalCards - 1) / 2) * stepPercent;
          const xPos = `${xPosVal}vw`;

          const normIndex = (index - (totalCards - 1) / 2) / ((totalCards - 1) / 2);
          const yArcVal = Math.pow(normIndex, 2) * 35 - 15;
          const rotZVal = normIndex * 18;
          const spreadScale = 0.3;
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
              x: isMobile ? 0 : xPos,
              y: yArcVal,
              z: isMobile ? 80 : 50,
              rotationY: isMobile ? 0 : 0,
              rotationZ: isMobile ? 0 : rotZVal,
              scale: isMobile ? 0.74 : spreadScale,
              transformOrigin: '50% 50%',
              zIndex: spreadZIndex,
              duration: 3,
              ease: 'back.out(1.2)',
            },
            'spreadAll'
          );

          tl.to(
            cardId,
            {
              rotationX: 166,
              duration: 2.5,
              ease: 'power2.out',
            },
            'spreadAll'
          );
        });

        /* Hold the finished fan so the following CTA section scrolls over the pinned scene. */
        tl.to({}, { duration: 3.5 });
        cards.forEach((card) => {
          tl.to(`#${card.id}`, {
            ...(isMobile ? {} : { scale: 0.276 }),
            filter: 'blur(3px)',
            duration: 3.5,
            ease: 'power1.inOut',
          }, 'spreadAll+=3.5');
        });

        const fanReadyAt = (tl.labels.spreadAll ?? tl.duration()) + 2.5;
        tl.eventCallback('onUpdate', () => updateFanState(tl.time() >= fanReadyAt));
        tl.eventCallback('onComplete', () => updateFanState(true));
        tl.eventCallback('onReverseComplete', () => updateFanState(false));
        scrollTriggerRef.current = tl.scrollTrigger ?? null;

        sceneEl.classList.add('scene-ready');
        ScrollTrigger.refresh();
      }, containerRef);
    };

    initAnimation();

    return () => {
      isCancelled = true;
      removeLenisListener?.();
      ctx?.revert();
      scrollTriggerRef.current = null;
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
    const zoomPose = getCardZoomPose(card.id, isMobile ? 0.92 : 1.42);
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
    if (suppressCardClickRef.current) {
      suppressCardClickRef.current = false;
      return;
    }

    if (useStaticDeck) {
      setMobileCardFlipped((flipped) => !flipped);
      return;
    }

    if (isMobileViewport() && isFanned && activeFocusedCard !== cardId) {
      const clickedIndex = cards.findIndex((card) => card.id === cardId);
      if (clickedIndex !== mobileCardIndex) {
        void moveMobileFan(clickedIndex);
        return;
      }
    }

    if (!isFanned && activeFocusedCard && activeFocusedCard !== cardId) return;

    const gsapMod = await import('gsap');
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (!isFanned && !activeFocusedCard) {
      scrollTriggerRef.current?.disable(false);
    }

    if (activeFocusedCard === cardId) {
      if (isMobile && isFanned) {
        void moveMobileFan(mobileCardIndex);
        return;
      }
      if (!isFanned) {
        setActiveFocusedCard(null);
        scrollTriggerRef.current?.enable();
        return;
      }
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

      setActiveFocusedCard(null);
      if (!isFanned) scrollTriggerRef.current?.enable();
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

      if (!isFanned) {
        gsap.to(`#${cardId}`, {
          rotationX: 166,
          rotationY: 0,
          duration: 0.65,
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

      setActiveFocusedCard(cardId);
    }
  };

  const dismissFocus = async () => {
    if (!activeFocusedCard) return;

    if (isFanned && isMobileViewport()) {
      void moveMobileFan(mobileCardIndex);
      return;
    }

    if (!isFanned) {
      setActiveFocusedCard(null);
      scrollTriggerRef.current?.enable();
      return;
    }

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

    setActiveFocusedCard(null);
    if (!isFanned) scrollTriggerRef.current?.enable();
  };

  const moveMobileFan = useCallback(async (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(cards.length - 1, nextIndex));
    setMobileCardIndex(boundedIndex);
    setActiveFocusedCard(null);
    setMobileCardFlipped(false);
    if (useStaticDeck || !isMobileViewport()) return;
    const gsapMod = await import('gsap');
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
    const cardWidth = Math.min(window.innerWidth * 0.76, 320);
    const availableHeight = window.innerHeight * 0.64;
    const focusedScale = Math.max(0.52, Math.min(0.76, availableHeight / (cardWidth * 16 / 9)));

    cards.forEach((card, index) => {
      const distance = index - boundedIndex;
      const absDistance = Math.abs(distance);
      gsap.to(`#${card.id}`, {
        x: `${distance * 56}vw`,
        y: Math.min(absDistance, 2) * 10,
        z: 80 - absDistance * 65,
        rotationY: Math.max(-28, Math.min(28, distance * -12)),
        rotationZ: 0,
        scale: Math.max(0.42, focusedScale - absDistance * 0.12),
        zIndex: cards.length - absDistance,
        pointerEvents: absDistance <= 1 ? 'auto' : 'none',
        duration: 0.65,
        ease: 'power3.out',
      });
    });
  }, [useStaticDeck]);

  const handleCardPointerDown = (event: React.PointerEvent<HTMLDivElement>, cardId: string) => {
    if (event.pointerType !== 'touch' || !isFanned || activeFocusedCard) return;
    if (isMobileViewport()) event.currentTarget.setPointerCapture(event.pointerId);
    touchStartRef.current = { x: event.clientX, y: event.clientY, cardId };
  };

  const handleCardPointerUp = (event: React.PointerEvent<HTMLDivElement>, cardId: string) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || start.cardId !== cardId || !isMobileViewport()) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;
    suppressCardClickRef.current = true;
    window.setTimeout(() => { suppressCardClickRef.current = false; }, 350);
    void moveMobileFan(mobileCardIndex + (deltaX < 0 ? 1 : -1));
  };

  const handleCardPointerMove = async (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch' || !touchStartRef.current || !isFanned || activeFocusedCard) return;
    const cardEl = event.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (event.clientY - rect.top) / rect.height - 0.5;
    const gsapMod = await import('gsap');
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
    gsap.to(cardEl, {
      rotationX: 166 - yRatio * 8,
      rotationY: xRatio * 10,
      duration: 0.18,
      overwrite: true,
    });
  };

  /* ── Dynamic 3D Depth & Tilt Effect on Mouse Move ── */
  const handleCardMouseMove = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobileViewport() || !isFanned || useStaticDeck) return;
    const cardEl = e.currentTarget;

    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    const tiltX = -yPct * 8;
    const tiltY = xPct * 10;

    const gsapMod = await import('gsap');
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
    gsap.to(cardEl, {
      rotationX: 166 + tiltX,
      rotationY: tiltY,
      duration: 0.2,
      ease: 'power1.out',
    });
  };

  const handleCardMouseLeave = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobileViewport() || !isFanned || useStaticDeck) return;
    const cardEl = e.currentTarget;

    const gsapMod = await import('gsap');
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
    gsap.to(cardEl, {
      rotationX: 166,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  useEffect(() => {
    if (!isFanned || useStaticDeck || !isMobileViewport()) return;
    void moveMobileFan(0);
  }, [isFanned, useStaticDeck, moveMobileFan]);

  return (
      <div ref={containerRef} className="w-full bg-[#FBFBFA] text-white overflow-x-hidden select-none">
      {/* ═══════════════ 3D PINNED DECK SCENE ═══════════════ */}
      <div
        id="scene-container"
        ref={sceneRef}
        data-fanned={isFanned}
        className="w-full h-[100dvh] min-h-[100svh] relative bg-[#FBFBFA] overflow-hidden"
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
        {/* Blurred card imagery stays behind the hero and deck during the pinned reveal. */}
        <div id="deck-backdrop" aria-hidden="true">
          {cards.map((card, index) => (
            <div key={`${card.id}-backdrop`} className="deck-backdrop-image">
              <Image
                src={card.image}
                alt=""
                fill
                sizes="100vw"
                quality={45}
                priority={index === 0}
              />
            </div>
          ))}
          <div className="deck-backdrop-shade" />
        </div>

        {/* Particle Glow Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden opacity-40 sm:block">
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
          className="scene-element !top-0 !left-1/2 w-[95vw] max-w-5xl text-center z-0 px-3 sm:px-4 pt-20 sm:pt-24 md:pt-28"
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
            Welcome to the <span className="text-[#E4B03A]">National Livestock Carnival</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-intro-item text-xs sm:text-base md:text-lg text-[#4B5563] max-w-4xl mx-auto font-medium leading-relaxed mb-4 sm:mb-6">
            Explore championship livestock, Nigerian culture, live performances, festival food and the carnival grounds. Scroll through the cards to discover what&apos;s waiting for you.
          </p>

          {/* Scroll cue */}
          <div className="hero-intro-item mt-6 sm:mt-8 flex flex-col items-center gap-1.5 animate-pulse">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[#8D6B1B]/90">
              Scroll Down to Explore
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
              className={`deck-card bg-gradient-to-br ${card.coverBg} w-[76vw] max-w-[320px] aspect-[9/16] md:w-[78vw] md:max-w-[880px] md:aspect-video lg:w-[80vw] lg:max-w-[960px] pointer-events-auto`}
              data-mobile-active={mobileCardIndex === Number(card.number) - 1}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onPointerDown={(event) => handleCardPointerDown(event, card.id)}
              onPointerMove={handleCardPointerMove}
              onPointerUp={(event) => handleCardPointerUp(event, card.id)}
              onPointerCancel={() => { touchStartRef.current = null; }}
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

                {/* ════ REVEALED CONTENT (Face Up State - Unique Card Color Theme) ════ */}
                <div
                  className={`card-face card-face-back bg-gradient-to-br ${card.coverBg} border-2 border-[#E4B03A]/45 shadow-[0_35px_100px_-15px_rgba(0,0,0,0.95)] flex flex-col justify-between rounded-[1.5rem]`}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent rounded-t-[1.5rem]" />

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
                          aria-label="Close focused card"
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

                    <div className="pt-2 sm:pt-0 relative z-30">
                      <Link
                        href={card.link}
                        className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#E4B03A] text-[#0A1A10] text-xs sm:text-sm font-extrabold uppercase tracking-[0.14em] sm:tracking-[0.16em] shadow-button transition-all group hover:bg-[#D4A030] hover:-translate-y-0.5 cursor-pointer pointer-events-auto relative z-30 opacity-100"
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

        <nav className="mobile-deck-controls" data-visible={isFanned && !useStaticDeck} aria-label="Carnival highlights">
          <button
            type="button"
            aria-label="Previous highlight"
            onClick={() => void moveMobileFan(mobileCardIndex - 1)}
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
            onClick={() => void moveMobileFan(mobileCardIndex + 1)}
            disabled={mobileCardIndex === cards.length - 1}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </nav>
      </div>

      {/* ═══════════════ EDITORIAL CLOSING SECTION (Rises over pinned fanned cards) ═══════════════ */}
      <section className="closing-cta-section w-full py-20 sm:py-24 bg-[#08150B] text-white relative overflow-hidden border-t border-[#E4B03A]/30">
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
