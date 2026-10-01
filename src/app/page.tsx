'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

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

type DeckControlMode = 'hidden' | 'skip' | 'top' | 'magazine';
type NetworkInformation = { effectiveType?: string; saveData?: boolean };
type PerformanceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformation;
};

const smoothstep = (progress: number) => progress * progress * (3 - 2 * progress);

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

function MagazineFeature({ card, index }: { card: CardData; index: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { once: false, amount: 0.05 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 92%', 'end 8%'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.24, 0.72, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0.96, 1, 1, 0.96]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.28, 0.62, 0.95, 1], [0, 0.35, 1, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 0.58, 1], [0.96, 1, 1.035]);
  const categoryOpacity = useTransform(scrollYProgress, [0, 0.12, 0.2, 0.9, 1], [0, 0, 1, 1, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.21, 0.3, 0.91, 1], [0, 0, 1, 1, 0]);
  const bodyOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.92, 1], [0, 0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.39, 0.5, 0.94, 1], [0, 0, 1, 1, 0]);
  const categoryY = useTransform(scrollYProgress, [0.1, 0.2, 0.9, 1], [18, 0, 0, -10]);
  const titleY = useTransform(scrollYProgress, [0.2, 0.3, 0.91, 1], [20, 0, 0, -10]);
  const bodyY = useTransform(scrollYProgress, [0.3, 0.4, 0.92, 1], [20, 0, 0, -10]);
  const ctaY = useTransform(scrollYProgress, [0.39, 0.5, 0.94, 1], [18, 0, 0, -8]);
  const imageFirst = index % 2 === 0;

  return (
    <motion.article
      ref={sectionRef}
      id={index === 0 ? 'magazine-first-feature' : undefined}
      style={prefersReducedMotion ? undefined : { opacity, scale }}
      aria-hidden={!isInView && !prefersReducedMotion}
      inert={!isInView && !prefersReducedMotion}
      className="magazine-feature relative grid min-h-[18rem] aspect-[4/3] md:aspect-video md:min-h-0 grid-cols-[40%_60%] overflow-hidden rounded-xl border border-[#D9DDDA] bg-[#E5E7E6] shadow-[0_18px_55px_rgba(17,24,39,0.10)]"
    >
      <div className={`relative min-w-0 overflow-hidden ${imageFirst ? 'order-1' : 'order-2'}`}>
        <motion.div className="absolute inset-0" style={prefersReducedMotion ? undefined : { opacity: imageOpacity, scale: imageScale }}>
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(max-width: 767px) 42vw, 50vw"
            className="object-cover"
          />
        </motion.div>
        <div
          aria-hidden="true"
          className={`absolute inset-0 ${imageFirst ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-transparent via-[#E5E7E6]/25 to-[#E5E7E6]`}
        />
      </div>

      <div className={`relative z-10 flex min-w-0 flex-col justify-center bg-[#E5E7E6] px-3 py-5 sm:px-6 md:px-10 md:py-12 lg:px-14 ${imageFirst ? 'order-2' : 'order-1'}`}>
        <motion.p
          style={prefersReducedMotion ? undefined : { opacity: categoryOpacity, y: categoryY }}
          className="mb-2 text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#8D6B1B] sm:mb-4 sm:text-[10px] md:text-xs md:tracking-[0.22em]"
        >
          {card.eyebrow}
        </motion.p>
        <motion.h3
          style={prefersReducedMotion ? undefined : { opacity: titleOpacity, y: titleY }}
          className="text-sm font-black leading-tight text-[#111827] sm:text-xl md:text-3xl lg:text-4xl"
        >
          {card.title}
        </motion.h3>
        <motion.p
          style={prefersReducedMotion ? undefined : { opacity: bodyOpacity, y: bodyY }}
          className="mt-2 text-[10px] leading-snug text-[#354354] sm:mt-4 sm:text-sm sm:leading-relaxed md:text-base lg:text-lg"
        >
          {card.body}
        </motion.p>
        <motion.div style={prefersReducedMotion ? undefined : { opacity: ctaOpacity, y: ctaY }}>
          <Link
            href={card.link}
            className="mt-3 inline-flex min-h-9 max-w-full items-center gap-1.5 self-start text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#1E4D38] hover:text-[#8D6B1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4D38] sm:mt-6 sm:min-h-11 sm:gap-2 sm:text-[10px] sm:tracking-[0.14em] md:text-xs"
          >
            <span>{card.cta}</span>
            <ArrowRight aria-hidden="true" className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function Home() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const magazineRef = useRef<HTMLElement>(null);
  const isNavigatingRef = useRef(false);
  const isDeckHandoffRef = useRef(false);
  const skipAvailableRef = useRef(false);
  const skipInProgressRef = useRef(false);
  const deckControlModeRef = useRef<DeckControlMode>('hidden');
  const [isFanned, setIsFanned] = useState(false);
  const isFannedRef = useRef(false);
  const [activeFocusedCard, setActiveFocusedCard] = useState<string | null>(null);
  const [raisedCardId, setRaisedCardId] = useState<string | null>(null);
  const [mobileCardIndex, setMobileCardIndex] = useState(0);
  const [mobileCardFlipped, setMobileCardFlipped] = useState(false);
  const [deckStage, setDeckStage] = useState<'intro' | 'stack' | 'fan' | 'closing' | 'magazine'>('intro');
  const [useStaticDeck, setUseStaticDeck] = useState(false);
  const [performanceReady, setPerformanceReady] = useState(false);
  const [isMagazineOnly, setIsMagazineOnly] = useState(false);
  const [skipAvailable, setSkipAvailable] = useState(false);
  const [deckControlMode, setDeckControlMode] = useState<DeckControlMode>('hidden');
  const [skipInProgress, setSkipInProgress] = useState(false);
  const [skipTransitionVisible, setSkipTransitionVisible] = useState(false);
  const [skipTransitionCovered, setSkipTransitionCovered] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isFirstMagazineFeatureVisible, setIsFirstMagazineFeatureVisible] = useState(false);
  const cardFlipTimerRef = useRef<number | null>(null);
  const scrollTriggerRef = useRef<{
    disable: (revert?: boolean) => void;
    enable: () => void;
    refresh: () => void;
    update: () => void;
  } | null>(null);

  // Store original fanned positions for cards when in spread state
  const fannedCoordsRef = useRef<
    Record<
      string,
      { x: string | number; y: string | number; z: number; rotationZ: number; scale: number; zIndex: number }
    >
  >({});

  const isMobileViewport = () => window.matchMedia('(max-width: 767px)').matches;
  const prefersReducedMotion = useReducedMotion();
  const isMobileDeck = performanceReady && typeof window !== 'undefined' && isMobileViewport();
  // The performance fallback takes precedence over every deck presentation,
  // including the lightweight mobile carousel.
  const shouldRenderDeck = performanceReady;
  const performanceMode = !performanceReady ? 'checking' : isMagazineOnly ? 'magazine' : 'cinematic';

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const frame = window.requestAnimationFrame(() => {
      const performanceNavigator = navigator as PerformanceNavigator;
      const connection = performanceNavigator.connection;
      const lowDevice =
        (typeof performanceNavigator.deviceMemory === 'number' && performanceNavigator.deviceMemory <= 4) ||
        (typeof performanceNavigator.hardwareConcurrency === 'number' && performanceNavigator.hardwareConcurrency <= 4);
      const lowNetwork =
        connection?.saveData === true ||
        ['slow-2g', '2g', '3g'].includes(connection?.effectiveType?.toLowerCase() ?? '') ||
        navigator.onLine === false;
      const useMagazineOnly = lowDevice || lowNetwork;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setIsMagazineOnly(useMagazineOnly);
      setUseStaticDeck(!window.matchMedia('(max-width: 767px)').matches && (useMagazineOnly || reducedMotion));
      setPerformanceReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const updateScrollToTopVisibility = () => {
      setShowScrollToTop(window.scrollY > window.innerHeight * 0.65);
    };
    updateScrollToTopVisibility();
    window.addEventListener('scroll', updateScrollToTopVisibility, { passive: true });
    window.addEventListener('resize', updateScrollToTopVisibility);
    return () => {
      window.removeEventListener('scroll', updateScrollToTopVisibility);
      window.removeEventListener('resize', updateScrollToTopVisibility);
    };
  }, []);

  useEffect(() => {
    const firstFeature = document.getElementById('magazine-first-feature');
    if (!firstFeature) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFirstMagazineFeatureVisible(entry.isIntersecting),
      { threshold: 0.08 }
    );
    observer.observe(firstFeature);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!performanceReady) return;

    const sceneElement = sceneRef.current;
    if (isMobileDeck || !prefersReducedMotion) {
      const sceneEl = sceneElement;
      if (!sceneEl) return;

      sceneEl.classList.add('scene-ready');
      if (prefersReducedMotion) {
        sceneEl.dataset.deckStage = 'fan';
        const fanFrame = window.requestAnimationFrame(() => {
          setDeckStage('fan');
          isFannedRef.current = true;
          setIsFanned(true);
        });
        return () => {
          window.cancelAnimationFrame(fanFrame);
          isFannedRef.current = false;
          setIsFanned(false);
          sceneEl.classList.remove('scene-ready');
          delete sceneEl.dataset.deckStage;
        };
      }

      let isCancelled = false;
      let ctx: { revert: () => void } | null = null;
      const header = document.querySelector<HTMLElement>('header');
      const magazineSection = magazineRef.current;

      const initMobileAnimation = async () => {
        const gsapMod = await import('gsap');
        const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        if (isCancelled) return;

        const viewportHeight = window.innerHeight;

        ctx = gsap.context(() => {
          if (magazineSection) gsap.set(magazineSection, { zIndex: 70 });
          gsap.set('#welcome-title', { xPercent: -50, transformOrigin: '50% 0%' });
          sceneEl.dataset.deckStage = 'intro';
          sceneEl.style.zIndex = 'auto';
          isFannedRef.current = false;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sceneEl,
              start: 'top top',
              end: `+=${viewportHeight * 2.3}`,
              scrub: 0.22,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline.to('#welcome-title', {
            opacity: 0.08,
            duration: 0.85,
            ease: 'none',
          }, 0);
          timeline.to('#welcome-title-content', {
            scale: 0.62,
            transformOrigin: '50% 0%',
            duration: 0.85,
            ease: 'none',
          }, 0);
          timeline.to('#home-page', {
            backgroundColor: '#030A05',
            duration: 0.1,
          }, 0.45);

          timeline.to('#deck-container', {
            scale: 0.78,
            opacity: 0.45,
            duration: 0.4,
            ease: 'none',
          }, 1.7);
          timeline.to('#welcome-title', { opacity: 0, duration: 0.1 }, 1.7);

          timeline.eventCallback('onUpdate', () => {
            const time = timeline.time();
            const stage = time < 0.48 ? 'intro' : time < 1.12 ? 'stack' : time < 1.7 ? 'fan' : time < 2.1 ? 'closing' : 'magazine';
            if (sceneEl.dataset.deckStage !== stage) {
              sceneEl.dataset.deckStage = stage;
              setDeckStage(stage);
            }
            const isFanStage = stage === 'fan';
            if (isFannedRef.current !== isFanStage) {
              isFannedRef.current = isFanStage;
              setIsFanned(isFanStage);
            }
            header?.classList.toggle('mobile-scroll-underlay', time >= 0.45);
            sceneEl.style.zIndex = time >= 0.45 ? '60' : 'auto';
          });
          timeline.eventCallback('onReverseComplete', () => {
            sceneEl.dataset.deckStage = 'intro';
            setDeckStage('intro');
            isFannedRef.current = false;
            setIsFanned(false);
            header?.classList.remove('mobile-scroll-underlay');
            sceneEl.style.zIndex = 'auto';
          });
          timeline.eventCallback('onComplete', () => {
            sceneEl.dataset.deckStage = 'magazine';
            setDeckStage('magazine');
            isFannedRef.current = false;
            setIsFanned(false);
          });
          scrollTriggerRef.current = timeline.scrollTrigger ?? null;
          ScrollTrigger.refresh();
        }, containerRef);
      };

      void initMobileAnimation();
      return () => {
        isCancelled = true;
        ctx?.revert();
        header?.classList.remove('mobile-scroll-underlay');
        sceneEl.classList.remove('scene-ready');
        sceneEl.style.removeProperty('z-index');
        if (magazineSection) magazineSection.style.removeProperty('z-index');
        delete sceneEl.dataset.deckStage;
        isFannedRef.current = false;
        if (cardFlipTimerRef.current !== null) window.clearTimeout(cardFlipTimerRef.current);
      };
    }

    if (isMagazineOnly) {
      sceneElement?.classList.add('scene-ready');
      return () => sceneElement?.classList.remove('scene-ready');
    }

    // Force browser scroll to top on load
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;
    let removeLenisListener: (() => void) | null = null;
    let removePeekResizeListener: (() => void) | null = null;

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
      deckControlModeRef.current = 'hidden';
      setDeckControlMode('hidden');
      skipAvailableRef.current = false;
      setSkipAvailable(false);

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
        const getInitialPeekY = () => {
          const firstCard = document.getElementById('card-1');
          if (!firstCard) return window.innerHeight * 0.75;
          // A centered card needs this offset to leave roughly one-third visible
          // above the lower edge of the viewport.
          return Math.max(0, window.innerHeight / 2 + firstCard.offsetHeight / 6);
        };
        cards.forEach((card) => {
          const cardEl = `#${card.id}`;
          gsap.set(cardEl, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: card.id === 'card-1' && !prefersReducedMotion ? getInitialPeekY() : '110vh',
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
          deckControlModeRef.current = 'hidden';
          setDeckControlMode('hidden');
          skipAvailableRef.current = false;
          setSkipAvailable(false);
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

        if (!prefersReducedMotion) {
          const updateInitialPeek = () => {
            if ((tl.scrollTrigger?.progress ?? 1) > 0.001) return;
            gsap.set('#card-1', { y: getInitialPeekY() });
          };
          window.addEventListener('resize', updateInitialPeek);
          removePeekResizeListener = () => window.removeEventListener('resize', updateInitialPeek);
        }

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
          const mobileRotationX = isMobile ? 0 : pose.rotationX;
          const mobileRotationY = isMobile ? 0 : pose.rotationY;
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
              rotationX: mobileRotationX,
              rotationY: mobileRotationY,
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

        const controlStartAt = 0.08;
        const topControlAt = tl.labels['step-9'] ?? cardSequenceStart + 9 * cardStepDuration;

        /* ── FINAL CARD (Card 10): Flip & Focus in Center ── */
        const lastCard = cards[totalCards - 1];
        const lastCardId = `#${lastCard.id}`;
        const lastPose = revealPoses[(totalCards - 1) % revealPoses.length];
        const lastCardMobileRotationX = isMobile ? 0 : lastPose.rotationX;
        const lastCardMobileRotationY = isMobile ? 0 : lastPose.rotationY;
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
            rotationX: lastCardMobileRotationX,
            rotationY: lastCardMobileRotationY,
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
          const rotZVal = isMobile ? 0 : normIndex * 18;
          const spreadScale = isMobile ? 0.74 : 0.3;
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
              y: isMobile ? 12 + index * 2 : yArcVal,
              z: isMobile ? 20 : 50,
              rotationY: 0,
              rotationZ: rotZVal,
              scale: spreadScale,
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
              rotationX: isMobile ? 0 : 166,
              duration: 2.5,
              ease: 'power2.out',
            },
            'spreadAll'
          );
        });

        /* Ease into the magazine handoff slowly while the fan softens behind it. */
        const magazineHandoffDuration = 5.5;
        tl.to({}, { duration: magazineHandoffDuration });
        cards.forEach((card) => {
          tl.to(`#${card.id}`, {
            rotationX: isMobile ? 0 : 166,
            rotationY: 0,
            duration: 0.3,
            ease: 'power1.out',
          }, 'spreadAll+=3.2');
          tl.to(`#${card.id}`, {
            ...(isMobile ? {} : { scale: 0.24 }),
            duration: 3.5,
            ease: 'power1.inOut',
          }, `spreadAll+=${magazineHandoffDuration}`);
          tl.to(`#${card.id} .card-face`, {
            filter: 'blur(4px)',
            duration: magazineHandoffDuration,
            ease: 'power1.inOut',
          }, `spreadAll+=${magazineHandoffDuration}`);
        });

        const fanReadyAt = (tl.labels.spreadAll ?? tl.duration()) + 2.5;
        const handoffLockAt = (tl.labels.spreadAll ?? tl.duration()) + 3.2;
        tl.eventCallback('onUpdate', () => {
          isDeckHandoffRef.current = tl.time() >= handoffLockAt;
          updateFanState(tl.time() >= fanReadyAt);
          let nextControlMode: DeckControlMode = 'hidden';
          if (tl.time() >= controlStartAt) nextControlMode = 'skip';
          if (tl.time() >= topControlAt) nextControlMode = 'top';
          if (tl.time() >= tl.duration() - 0.01) nextControlMode = 'magazine';
          if (deckControlModeRef.current !== nextControlMode) {
            deckControlModeRef.current = nextControlMode;
            setDeckControlMode(nextControlMode);
          }
          const nextSkipAvailable = nextControlMode === 'skip';
          if (skipAvailableRef.current !== nextSkipAvailable) {
            skipAvailableRef.current = nextSkipAvailable;
            setSkipAvailable(nextSkipAvailable);
          }
        });
        tl.eventCallback('onComplete', () => {
          updateFanState(true);
          deckControlModeRef.current = 'magazine';
          setDeckControlMode('magazine');
          skipAvailableRef.current = false;
          setSkipAvailable(false);
        });
        tl.eventCallback('onReverseComplete', () => {
          isDeckHandoffRef.current = false;
          updateFanState(false);
          deckControlModeRef.current = 'hidden';
          setDeckControlMode('hidden');
          skipAvailableRef.current = false;
          setSkipAvailable(false);
        });
        scrollTriggerRef.current = tl.scrollTrigger ?? null;

        sceneEl.classList.add('scene-ready');
        ScrollTrigger.refresh();
      }, containerRef);
    };

    initAnimation();

    return () => {
      isCancelled = true;
      removeLenisListener?.();
      removePeekResizeListener?.();
      ctx?.revert();
      scrollTriggerRef.current = null;
      sceneElement?.classList.remove('scene-ready');
    };
  }, [performanceReady, isMagazineOnly, isMobileDeck, prefersReducedMotion]);

  const runCoveredScroll = (targetY: number, afterScroll?: () => void) => {
    if (skipInProgressRef.current) return;

    skipInProgressRef.current = true;
    setSkipInProgress(true);
    let finished = false;
    let coverTimer = 0;
    let fallbackTimer = 0;
    let animationFrame = 0;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(coverTimer);
      window.clearTimeout(fallbackTimer);
      window.cancelAnimationFrame(animationFrame);
      setSkipTransitionVisible(false);
      setSkipTransitionCovered(false);
      skipInProgressRef.current = false;
      setSkipInProgress(false);
      afterScroll?.();
    };

    const startScroll = () => {
      const clampedTarget = Math.max(0, Math.min(targetY, document.documentElement.scrollHeight - window.innerHeight));
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lenis = (window as Window & {
        __lenisInstance?: {
          scrollTo: (
            target: number,
            options: { duration?: number; easing?: (progress: number) => number; immediate?: boolean; lock?: boolean; onComplete?: () => void }
          ) => void;
        };
      }).__lenisInstance;

      if (reducedMotion) {
        fallbackTimer = window.setTimeout(finish, 250);
        if (lenis) lenis.scrollTo(clampedTarget, { immediate: true, onComplete: finish });
        else {
          window.scrollTo({ top: clampedTarget, left: 0, behavior: 'instant' });
          finish();
        }
        return;
      }

      if (lenis) {
        lenis.scrollTo(clampedTarget, {
          duration: 1.4,
          easing: smoothstep,
          lock: true,
          onComplete: finish,
        });
        fallbackTimer = window.setTimeout(finish, 2200);
        return;
      }

      const startY = window.scrollY;
      const distance = clampedTarget - startY;
      if (Math.abs(distance) < 1) {
        finish();
        return;
      }

      let startTime: number | null = null;
      const animate = (time: number) => {
        if (startTime === null) startTime = time;
        const progress = Math.min((time - startTime) / 1400, 1);
        window.scrollTo({ top: startY + distance * smoothstep(progress), left: 0, behavior: 'instant' });
        if (progress >= 1) finish();
        else animationFrame = window.requestAnimationFrame(animate);
      };
      animationFrame = window.requestAnimationFrame(animate);
      fallbackTimer = window.setTimeout(finish, 2200);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      startScroll();
      return;
    }

    setSkipTransitionVisible(true);
    setSkipTransitionCovered(false);
    window.requestAnimationFrame(() => setSkipTransitionCovered(true));
    coverTimer = window.setTimeout(startScroll, 520);
  };

  const handleSkipToMagazine = () => {
    if (!magazineRef.current || !skipAvailable || skipInProgressRef.current) return;
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 72;
    const targetY = window.scrollY + magazineRef.current.getBoundingClientRect().top - headerHeight - 12;
    runCoveredScroll(targetY, () => {
      deckControlModeRef.current = 'magazine';
      setDeckControlMode('magazine');
      skipAvailableRef.current = false;
      setSkipAvailable(false);
      magazineRef.current?.focus({ preventScroll: true });
    });
  };

  const handleControlClick = () => {
    if (activeControlMode === 'skip') {
      handleSkipToMagazine();
      return;
    }

    if (activeControlMode !== 'hidden') runCoveredScroll(0);
  };

  const activeControlMode: DeckControlMode = isMagazineOnly || useStaticDeck
    ? showScrollToTop && isFirstMagazineFeatureVisible ? 'magazine' : 'hidden'
    : deckControlMode === 'magazine' && !isFirstMagazineFeatureVisible ? 'hidden' : deckControlMode;
  const controlHidden = activeControlMode === 'hidden';
  const controlIsSkip = activeControlMode === 'skip';
  const controlLabel = controlIsSkip ? 'Skip 3D cards and view highlights' : 'Go to top';

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
  const handleCardClick = (cardId: string) => {
    if (sceneRef.current?.dataset.deckStage !== 'fan' || activeFocusedCard) return;

    const clickedIndex = cards.findIndex((card) => card.id === cardId);
    setMobileCardIndex(clickedIndex);
    if (raisedCardId !== cardId) {
      setRaisedCardId(cardId);
      setMobileCardFlipped(false);
      return;
    }

    setActiveFocusedCard(cardId);
    scrollTriggerRef.current?.disable(false);
    if (cardFlipTimerRef.current !== null) window.clearTimeout(cardFlipTimerRef.current);
    cardFlipTimerRef.current = window.setTimeout(() => {
      setMobileCardFlipped(true);
      cardFlipTimerRef.current = null;
    }, 380);
  };

  const dismissFocus = () => {
    if (!activeFocusedCard && !raisedCardId) return;
    if (cardFlipTimerRef.current !== null) {
      window.clearTimeout(cardFlipTimerRef.current);
      cardFlipTimerRef.current = null;
    }
    setActiveFocusedCard(null);
    setRaisedCardId(null);
    setMobileCardFlipped(false);
    sceneRef.current!.dataset.deckStage = 'fan';
    setDeckStage('fan');
    isFannedRef.current = true;
    setIsFanned(true);
    const trigger = scrollTriggerRef.current;
    window.requestAnimationFrame(() => {
      trigger?.enable();
      trigger?.update();
    });
  };

  const moveMobileFan = useCallback((nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(cards.length - 1, nextIndex));
    setMobileCardIndex(boundedIndex);
    setRaisedCardId(cards[boundedIndex].id);
    setMobileCardFlipped(false);
  }, []);

  return (
      <div
        id="home-page"
        ref={containerRef}
        data-performance-mode={performanceMode}
        data-deck-scroll={!prefersReducedMotion}
        data-mobile-scroll={isMobileDeck && !prefersReducedMotion}
        className="w-full bg-[#FBFBFA] text-white overflow-x-hidden select-none"
      >
      {/* ═══════════════ 3D PINNED DECK SCENE ═══════════════ */}
      <div
        id="scene-container"
        ref={sceneRef}
        data-fanned={isFanned || (shouldRenderDeck && isMobileDeck)}
        data-deck-stage={deckStage}
        data-expanded-card={activeFocusedCard !== null}
        data-mobile-scroll={isMobileDeck && !prefersReducedMotion}
        data-magazine-only={isMagazineOnly || !performanceReady}
        className="w-full h-[100dvh] min-h-[100svh] relative bg-[#FBFBFA] overflow-hidden"
        onClick={(e) => {
          if (
            (activeFocusedCard || raisedCardId) &&
            e.target instanceof HTMLElement &&
            !e.target.closest('.deck-card')
          ) {
            dismissFocus();
          }
        }}
      >
        {shouldRenderDeck && (
          <>
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

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(228,176,58,0.12)_0%,transparent_75%)] pointer-events-none z-0" />
          </>
        )}

        {/* ── HERO TEXT (Top-anchored so logo emblem is 100% visible below sticky header) ── */}
        <div
          id="welcome-title"
          className="scene-element !top-0 !left-1/2 w-[95vw] max-w-5xl text-center z-0 px-3 sm:px-4 pt-20 sm:pt-24 md:pt-28"
        >
          <div id="welcome-title-content" className="origin-top">
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
        </div>

        {/* ── THE 3D DECK CONTAINER ── */}
        {shouldRenderDeck && <div
          id="deck-container"
          data-static-deck={useStaticDeck}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              id={card.id}
              /*
                EXPANSIVE CANVAS CARD DIMENSIONS:
                Portrait cards on mobile; landscape cards on desktop.
              */
              className={`deck-card bg-gradient-to-br ${card.coverBg} w-[76vw] max-w-[320px] aspect-[9/16] md:w-[78vw] md:max-w-[880px] md:aspect-video lg:w-[80vw] lg:max-w-[960px] pointer-events-auto`}
              data-deck-index={index}
              data-raised={raisedCardId === card.id}
              data-expanded={activeFocusedCard === card.id}
              data-flipped={mobileCardFlipped && activeFocusedCard === card.id}
              onClick={() => handleCardClick(card.id)}
                          style={{
                            '--fan-x': `${(index - (cards.length - 1) / 2) * (isMobileDeck ? 7.2 : 6.8)}vw`,
                            '--fan-y': `${Math.pow((index - (cards.length - 1) / 2) / ((cards.length - 1) / 2), 2) * (isMobileDeck ? 24 : 42)}px`,
                            '--fan-rotation': `${(index - (cards.length - 1) / 2) * (isMobileDeck ? 2.8 : 3.8)}deg`,
                            '--fan-scale': isMobileDeck ? 0.58 : 0.4,
                            '--stack-y': `${index * 1.2}px`,
                            '--stack-z': `${cards.length - index}`,
                            '--fan-z': `${Math.round(100 - Math.abs(index - (cards.length - 1) / 2) * 10) + (index <= (cards.length - 1) / 2 ? 1 : 0)}`,
                          } as CSSProperties}
            >
              <div className="card-inner" data-mobile-flipped={mobileCardFlipped && activeFocusedCard === card.id}>
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
        </div>}

        {activeFocusedCard && (
          <button
            type="button"
            onClick={dismissFocus}
            className="deck-card-close"
            aria-label="Close selected card"
            title="Close selected card"
          >
            <X aria-hidden="true" />
          </button>
        )}

        {shouldRenderDeck && <nav className="mobile-deck-controls" data-visible={isFanned && !activeFocusedCard} aria-label="Carnival highlights">
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
        </nav>}

      </div>

      <section
        ref={magazineRef}
        id="magazine-highlights"
        tabIndex={-1}
        aria-labelledby="magazine-highlights-title"
        className="magazine-highlights-section bg-[#FBFBFA] text-[#111827] border-t border-[#E4B03A]/35"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <ScrollReveal direction="up" duration={0.8} once>
            <div className="mb-10 max-w-3xl sm:mb-14">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#8D6B1B]">
                Explore the carnival
              </p>
              <h2 id="magazine-highlights-title" className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Ten ways to experience the celebration
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#4B5563] sm:text-base">
                From championship breeds and cultural pageantry to live music, food, and the festival grounds, find the experiences you want to explore.
              </p>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
            {cards.map((card, index) => (
              <MagazineFeature key={`magazine-${card.id}`} card={card} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA follows the magazine highlights. */}
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

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[100] bg-[#FBFBFA] transition-opacity duration-500 ease-in-out ${skipTransitionVisible ? (skipTransitionCovered ? 'opacity-100' : 'opacity-0') : 'opacity-0'}`}
      />

      <div className="pointer-events-none fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-1/2 z-[70] -translate-x-1/2 md:bottom-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <motion.button
          type="button"
          id="deck-navigation-control"
          aria-label={controlLabel}
          title={controlLabel}
          aria-hidden={controlHidden}
          tabIndex={controlHidden ? -1 : 0}
          disabled={controlHidden || skipInProgress}
          animate={{
            opacity: controlHidden ? 0 : 1,
            scale: controlHidden ? 0.78 : 1,
            width: controlHidden || controlIsSkip ? 40 : activeControlMode === 'top' ? 120 : 136,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          onClick={handleControlClick}
          className={`pointer-events-auto flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full border px-2 text-[#1E4D38] shadow-[0_8px_30px_rgba(3,10,5,0.16)] backdrop-blur-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4B03A] ${activeControlMode === 'magazine' ? 'border-white/80 bg-white/60' : 'border-white/80 bg-white/55'}`}
        >
          <motion.span
            initial={false}
            animate={{ rotate: controlIsSkip ? 0 : 180, opacity: controlHidden ? 0 : 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex shrink-0"
          >
            <ArrowDown aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
          </motion.span>
          {(activeControlMode === 'top' || activeControlMode === 'magazine') && (
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : 0.12 }}
              className="whitespace-nowrap text-xs font-bold"
            >
              Go to top
            </motion.span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
