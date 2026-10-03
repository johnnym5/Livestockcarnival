'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { DEFAULT_HOMEPAGE_MOTION, normalizeHomepageMotion, type HomepageMotionSettings } from '@/lib/homepageMotion';
import type { CardData } from '@/lib/homepageCards';
import { HomepageMagazineHeading } from '@/components/homepage/HomepageMagazine';
import { HOMEPAGE_MAGAZINE_DESTINATIONS, type HomepageMagazineStory } from '@/lib/homepageMagazine';
import { supabase } from '@/lib/supabase/client';

interface MagazineIntro {
  eyebrow: string;
  title: string;
  intro: string;
  backgroundColor: string;
  accentColor: string;
}

interface HomepageCardDeckProps {
  cards: CardData[];
  magazine: MagazineIntro;
  leadStory?: HomepageMagazineStory;
  enabled: boolean;
}

function coverGradient(value: string) {
  const colors = value.match(/#[\da-f]{3,8}/gi) ?? [];
  if (colors.length > 1) return `linear-gradient(135deg, ${colors[0]}, ${colors[colors.length - 1]})`;
  return `linear-gradient(135deg, ${colors[0] ?? '#0D4020'}, #031209)`;
}

function useWindowHeight() {
  const [height, setHeight] = useState(800);
  useEffect(() => {
    const update = () => setHeight(window.innerHeight);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);
  return height;
}

function DeckCard({
  card,
  index,
  count,
  progress,
  settings,
  mobile,
  viewportWidth,
  raised,
  folded,
  foldDuration,
  reducedMotion,
  registerButton,
  onSelect,
}: {
  card: CardData;
  index: number;
  count: number;
  progress: MotionValue<number>;
  settings: HomepageMotionSettings;
  mobile: boolean;
  viewportWidth: number;
  raised: boolean;
  folded: boolean;
  foldDuration: number;
  reducedMotion: boolean;
  registerButton: (id: string, element: HTMLButtonElement | null) => void;
  onSelect: (card: CardData) => void;
}) {
  const center = (count - 1) / 2;
  const offset = index - center;
  const normalizedOffset = center === 0 ? 0 : offset / center;
  const spread = mobile ? settings.fanSpreadMobile : settings.fanSpreadDesktop;
  const spreadPixels = Math.min(viewportWidth * 0.31, spread * (mobile ? 2.5 : 4.1));
  const restackStart = settings.fanHoldEndProgress + (settings.magazineEndProgress - settings.fanHoldEndProgress) * settings.magazineRestackAt;
  // Stagger the fan opening from left to right while keeping it scroll reversible.
  // All cards remain visible in the stack; the fan stage gently fades and slides
  // each card outward in sequence instead of firing a one-time CSS animation.
  const fanSpan = settings.fanEndProgress - settings.fanStartProgress;
  const cardRank = count <= 1 ? 0 : index / (count - 1);
  const cardFanStart = settings.fanStartProgress + fanSpan * cardRank * 0.35;
  const cardFanEnd = settings.fanStartProgress + fanSpan * (0.65 + cardRank * 0.35);
  const cardStages = [0, cardFanStart, cardFanEnd, restackStart, settings.magazineEndProgress];
  const x = useTransform(progress, cardStages, [0, 0, normalizedOffset * spreadPixels, normalizedOffset * spreadPixels, 0]);
  const rotate = useTransform(progress, cardStages, [0, 0, normalizedOffset * (mobile ? 17 : 20), normalizedOffset * (mobile ? 17 : 20), 0]);
  const localY = useTransform(progress, cardStages, [Math.abs(normalizedOffset) * settings.stackPeek * 22, Math.abs(normalizedOffset) * settings.stackPeek * 22, Math.abs(normalizedOffset) * (mobile ? 15 : 20), Math.abs(normalizedOffset) * (mobile ? 15 : 20), 0]);
  const opacity = useTransform(progress, [0, cardFanStart, cardFanEnd, settings.fanHoldEndProgress, restackStart, settings.magazineEndProgress], [1, 0.82, 1, 1, 1, 1]);
  const fanX = reducedMotion ? normalizedOffset * (mobile ? 22 : 72) : x.get();
  const fanY = reducedMotion ? Math.abs(normalizedOffset) * 8 : localY.get();
  const fanRotate = reducedMotion ? normalizedOffset * (mobile ? 12 : 16) : rotate.get();
  return (
    <motion.div
      className="homepage-deck-card-position"
      style={{ x: reducedMotion ? normalizedOffset * (mobile ? 22 : 72) : x, y: reducedMotion ? Math.abs(normalizedOffset) * 8 : localY, rotate: reducedMotion ? normalizedOffset * (mobile ? 12 : 16) : rotate, opacity: reducedMotion ? 1 : opacity, zIndex: raised ? 1000 : 100 + index }}
    >
      <motion.div
        className="homepage-deck-card-fold"
        animate={folded ? { x: -fanX, y: -fanY, rotate: -fanRotate, scale: 0.97 } : { x: 0, y: 0, rotate: 0, scale: 1 }}
        transition={{ duration: foldDuration, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.button
          ref={(element) => registerButton(card.id, element)}
          type="button"
          data-homepage-deck-card={card.id}
          aria-label={`Select ${card.title}; select again to open`}
          aria-pressed={raised}
          onClick={() => onSelect(card)}
          animate={{ scale: raised && !folded ? 1.045 : 1, y: raised && !folded ? -24 : 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="homepage-deck-card"
          style={{ background: coverGradient(card.coverBg), borderColor: card.accentColor, boxShadow: `inset 0 1px 0 rgba(255,255,255,.14), 0 16px 36px rgba(10,20,12,.22), 0 14px 35px ${card.accentColor}33` }}
        >
          <Image src="/assets/branding/carnival-logo-transparent.png" alt="" width={118} height={90} className="homepage-deck-logo" />
          <span className="homepage-deck-card-label">{card.pageTitle || card.title}</span>
          <span className="homepage-deck-number" style={{ color: card.accentColor }}>{card.number}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function OpenCard({
  card,
  rect,
  duration,
  closeDuration,
  openStartScale,
  openEndScale,
  closeStartScale,
  closeEndScale,
  expandedScale,
  mobile,
  onClosing,
  onClose,
}: {
  card: CardData;
  rect: DOMRect;
  duration: number;
  closeDuration: number;
  openStartScale: number;
  openEndScale: number;
  closeStartScale: number;
  closeEndScale: number;
  expandedScale: number;
  mobile: boolean;
  onClosing: () => void;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const safeDuration = Math.max(0.1, duration);
  const safeCloseDuration = Math.max(0.1, closeDuration);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClosing();
        setClosing(true);
      }
      if (event.key === 'Tab') {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]') ?? []);
        const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
        const nextIndex = event.shiftKey ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1) : (currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1);
        event.preventDefault();
        focusable[nextIndex]?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClosing]);

  const start = { left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: 18 };
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const expandedWidth = Math.min(window.innerWidth * (mobile ? 0.92 : 0.86), window.innerWidth * expandedScale);
  const expandedHeight = Math.min(viewportHeight * (mobile ? 0.82 : 0.86), viewportHeight * expandedScale);
  const full = { left: (window.innerWidth - expandedWidth) / 2, top: Math.max(12, (window.innerHeight - expandedHeight) / 2), width: expandedWidth, height: expandedHeight, borderRadius: 20 };

  return createPortal((
    <div className="homepage-deck-modal-layer" role="presentation">
      <motion.div className="homepage-deck-backdrop" initial={{ opacity: 0 }} animate={{ opacity: closing ? 0 : 1 }} transition={{ duration: (closing ? safeCloseDuration : safeDuration) * 0.5 }} />
      <motion.div
        role="dialog"
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby="homepage-open-card-title"
        className="homepage-deck-open-card"
        initial={start}
        animate={closing ? start : full}
        transition={{ duration: closing ? safeCloseDuration : safeDuration, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => { if (closing) onClose(); }}
        style={{ perspective: mobile ? undefined : 1600 }}
      >
        {mobile ? <>
          <motion.div
            className="homepage-deck-open-face homepage-deck-open-front"
            initial={{ opacity: 1, scaleX: 1 }}
            animate={closing ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.04 }}
            transition={{ duration: (closing ? safeCloseDuration : safeDuration) * 0.48, delay: closing ? safeCloseDuration * 0.52 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: coverGradient(card.coverBg), borderColor: card.accentColor }}
          >
            <Image src="/assets/branding/carnival-logo-transparent.png" alt="Livestock Carnival" width={220} height={166} className="homepage-deck-open-logo" />
            <span className="homepage-deck-open-title">{card.pageTitle || card.title}</span>
            <span className="homepage-deck-open-number" style={{ color: card.accentColor }}>{card.number}</span>
          </motion.div>
          <motion.div
            className="homepage-deck-open-face homepage-deck-open-back homepage-deck-open-mobile-content"
            initial={{ opacity: 0, scaleX: 0.04 }}
            animate={closing ? { opacity: 0, scaleX: 0.04 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: (closing ? safeCloseDuration : safeDuration) * 0.48, delay: closing ? 0 : safeDuration * 0.52, ease: [0.22, 1, 0.36, 1] }}
            style={{ borderColor: card.accentColor }}
          >
            <div className="homepage-deck-open-image">
              <Image src={card.image} alt={card.title} fill sizes="100vw" priority className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06150D]/75 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/50 bg-black/30 px-3 py-1 text-xs font-bold tracking-[0.18em] text-white">{card.number}</span>
            </div>
            <div className="homepage-deck-open-copy">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8D6B1B] sm:text-xs">{card.eyebrow}</p>
              <h2 id="homepage-open-card-title" className="mt-2 text-xl font-black leading-tight sm:text-3xl">{card.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4B5563] sm:text-base">{card.body}</p>
              <Link href={card.link} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0D4027] px-5 text-xs font-extrabold uppercase tracking-[0.12em] text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">
                {card.cta}<ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <button ref={closeButtonRef} type="button" onClick={() => { onClosing(); setClosing(true); }} aria-label="Close card" className="homepage-deck-close"><X aria-hidden="true" size={22} /></button>
          </motion.div>
        </> : <motion.div
          className="homepage-deck-open-inner"
          initial={{ rotateY: 0, scale: openStartScale }}
          animate={closing ? { rotateY: 0, scale: [closeStartScale, closeEndScale] } : { rotateY: 180, scale: openEndScale }}
          transition={{ duration: closing ? safeCloseDuration : safeDuration, ease: [0.3, 0.05, 0.2, 1] }}
        >
          <motion.div
            className="homepage-deck-open-face homepage-deck-open-front"
            initial={{ opacity: 1 }}
            animate={{ opacity: closing ? 1 : 0 }}
            transition={{ duration: (closing ? safeCloseDuration : safeDuration) * 0.45, delay: closing ? safeCloseDuration * 0.5 : 0, ease: 'easeInOut' }}
            style={{ background: coverGradient(card.coverBg), borderColor: card.accentColor }}
          >
            <Image src="/assets/branding/carnival-logo-transparent.png" alt="Livestock Carnival" width={220} height={166} className="homepage-deck-open-logo" />
            <span className="homepage-deck-open-title">{card.pageTitle || card.title}</span>
            <span className="homepage-deck-open-number" style={{ color: card.accentColor }}>{card.number}</span>
          </motion.div>
          <motion.div
            className="homepage-deck-open-face homepage-deck-open-back"
            initial={{ opacity: 0 }}
            animate={{ opacity: closing ? 0 : 1 }}
            transition={{ duration: (closing ? safeCloseDuration : safeDuration) * 0.45, delay: closing ? 0 : safeDuration * 0.5, ease: 'easeInOut' }}
            style={{ borderColor: card.accentColor }}
          >
            <div className="homepage-deck-open-image">
              <Image src={card.image} alt={card.title} fill sizes="100vw" priority className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06150D]/75 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/50 bg-black/30 px-3 py-1 text-xs font-bold tracking-[0.18em] text-white">{card.number}</span>
            </div>
            <div className="homepage-deck-open-copy">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8D6B1B] sm:text-xs">{card.eyebrow}</p>
              <h2 id="homepage-open-card-title" className="mt-2 text-xl font-black leading-tight sm:text-3xl">{card.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4B5563] sm:text-base">{card.body}</p>
              <Link href={card.link} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0D4027] px-5 text-xs font-extrabold uppercase tracking-[0.12em] text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">
                {card.cta}<ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <button ref={closeButtonRef} type="button" onClick={() => { onClosing(); setClosing(true); }} aria-label="Close card" className="homepage-deck-close"><X aria-hidden="true" size={22} /></button>
          </motion.div>
        </motion.div>}
      </motion.div>
    </div>
  ), document.body);
}

export default function HomepageCardDeck({ cards, magazine, leadStory, enabled }: HomepageCardDeckProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const cardButtonsRef = useRef(new Map<string, HTMLButtonElement>());
  const deckReturnTimerRef = useRef<number | null>(null);
  const openingScrollRef = useRef(0);
  const pageOverflowRef = useRef<{ body: string; document: string } | null>(null);
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_MOTION);
  const [revealed, setRevealed] = useState(false);
  const [raisedCard, setRaisedCard] = useState<string | null>(null);
  const [openedCard, setOpenedCard] = useState<{ card: CardData; rect: DOMRect } | null>(null);
  const [pendingOpenCard, setPendingOpenCard] = useState<{ card: CardData; rect: DOMRect } | null>(null);
  const [foldMode, setFoldMode] = useState<'spread' | 'fold-others' | 'folded'>('spread');
  const [isMobile, setIsMobile] = useState(false);
  const [lowPowerDevice, setLowPowerDevice] = useState(false);
  const [isClosingCard, setIsClosingCard] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1024);
  const reducedMotion = useReducedMotion();
  // Older phones often report four or fewer logical cores. That is not a
  // reason to disable the scroll timeline altogether: on iOS this made the
  // deck remain in its static stack until the magazine entered. Keep the full
  // transform-only timeline enabled and use lowPowerDevice only to reduce blur.
  const simplifyMotion = Boolean(reducedMotion);
  const foldDuration = simplifyMotion ? 0.1 : 0.32;
  const viewportHeight = useWindowHeight();
  const stickyHeaderHeight = isMobile ? 56 : 72;
  const sceneEndPercent = 100 - (stickyHeaderHeight / viewportHeight) * 100;
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', `end ${sceneEndPercent}%` as `end ${number}%`] });

  useEffect(() => {
    let active = true;
    void supabase.from('homepage_motion_settings').select('settings').eq('id', 1).maybeSingle().then(({ data }) => {
      if (active && data?.settings) setSettings(normalizeHomepageMotion(data.settings));
    });
    const channel = supabase.channel('homepage-motion-settings-live')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'homepage_motion_settings', filter: 'id=eq.1' }, (payload) => {
        const nextSettings = (payload.new as { settings?: unknown }).settings;
        if (nextSettings) setSettings(normalizeHomepageMotion(nextSettings));
      })
      .subscribe();
    return () => { active = false; void supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const updateDevice = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
      setViewportWidth(window.innerWidth);
      setLowPowerDevice(Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
    };
    updateDevice();
    window.addEventListener('resize', updateDevice, { passive: true });
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  useEffect(() => {
    const beginReveal = () => setRevealed(true);
    window.addEventListener('homepage:reveal-start', beginReveal);
    window.addEventListener('homepage:scene-ready', beginReveal);
    if (document.getElementById('home-page')?.getAttribute('data-home-ready') === 'true') beginReveal();
    return () => {
      window.removeEventListener('homepage:reveal-start', beginReveal);
      window.removeEventListener('homepage:scene-ready', beginReveal);
    };
  }, []);

  useEffect(() => {
    if (!pendingOpenCard) return;
    const timer = window.setTimeout(() => {
      setOpenedCard(pendingOpenCard);
      setPendingOpenCard(null);
    }, foldDuration * 1000);
    return () => window.clearTimeout(timer);
  }, [pendingOpenCard, foldDuration]);

  useEffect(() => () => {
    if (deckReturnTimerRef.current !== null) window.clearTimeout(deckReturnTimerRef.current);
    const previous = pageOverflowRef.current;
    if (!previous) return;
    document.body.style.overflow = previous.body;
    document.documentElement.style.overflow = previous.document;
    pageOverflowRef.current = null;
  }, []);

  const heroScale = useTransform(scrollYProgress, [0, settings.cardScrollStart, settings.heroShrinkEnd], [isMobile ? settings.heroScaleOpeningMobile : settings.heroScaleOpeningDesktop, isMobile ? settings.heroScaleOpeningMobile : settings.heroScaleOpeningDesktop, isMobile ? settings.heroScaleCoveredMobile : settings.heroScaleCoveredDesktop]);
  const heroOpacity = useTransform(scrollYProgress, [0, settings.fanStartProgress, settings.fanEndProgress], [1, 1, 0.12]);
  const promptOpacity = useTransform(scrollYProgress, [settings.promptStartProgress, settings.promptEndProgress, settings.fanHoldEndProgress, settings.magazineEndProgress], [0, 1, 1, 0]);
  const promptScale = useTransform(scrollYProgress, [settings.promptStartProgress, settings.promptEndProgress, settings.fanHoldEndProgress, settings.magazineEndProgress], [0.88, 1, 1, 0.75]);
  const cueOpacity = useTransform(scrollYProgress, [0, settings.fanStartProgress * 0.45, settings.fanStartProgress], [1, 0.75, 0]);
  const stackOffset = settings.stackStartY * viewportHeight * (isMobile ? 0.7 : 1);
  const fanVerticalLift = viewportHeight * (isMobile ? 0.1 : 0.15);
  const restackStart = settings.fanHoldEndProgress + (settings.magazineEndProgress - settings.fanHoldEndProgress) * settings.magazineRestackAt;
  const deckY = useTransform(scrollYProgress, [0, settings.cardScrollStart, settings.fanStartProgress, settings.fanEndProgress, settings.fanHoldEndProgress, restackStart, settings.magazineEndProgress], [stackOffset, stackOffset - viewportHeight * 0.08, stackOffset - viewportHeight * 0.08, -fanVerticalLift, -fanVerticalLift, -fanVerticalLift, stackOffset]);
  const deckScale = useTransform(scrollYProgress, [0, settings.fanStartProgress, settings.fanEndProgress, restackStart, settings.magazineEndProgress], [isMobile ? settings.stackScaleMobile : settings.stackScaleDesktop, isMobile ? settings.stackScaleMobile : settings.stackScaleDesktop, isMobile ? settings.fanScaleMobile : settings.fanScaleDesktop, isMobile ? settings.fanScaleMobile : settings.fanScaleDesktop, (isMobile ? settings.stackScaleMobile : settings.stackScaleDesktop) * settings.magazineScale]);
  const magazineY = useTransform(scrollYProgress, [settings.fanHoldEndProgress, settings.magazineEndProgress], [viewportHeight, 0]);
  const atmosphereFadeEnd = settings.fanHoldEndProgress + (settings.magazineEndProgress - settings.fanHoldEndProgress) * 0.5;
  const deckOpacity = useTransform(scrollYProgress, [restackStart, settings.magazineEndProgress], [1, 0]);
  const atmosphereOpacity = useTransform(scrollYProgress, [settings.fanHoldEndProgress, atmosphereFadeEnd, settings.magazineEndProgress], [0.22 + (settings.heroBackgroundIntensity / 10) * 0.46, 0, 0]);
  const heroInitial = simplifyMotion ? false : 'hidden';
  const revealOrders = [
    ['logo', 'eyebrow', 'title', 'intro'],
    ['title', 'logo', 'eyebrow', 'intro'],
    ['logo', 'title', 'intro', 'eyebrow'],
    ['eyebrow', 'logo', 'title', 'intro'],
  ];
  const heroRevealOrder = revealOrders[Math.round(settings.heroRevealPreset)] ?? revealOrders[0];
  const heroSteps = { hidden: {}, visible: {} };
  const heroStep = (name: string) => {
    const delay = simplifyMotion ? 0 : 0.08 + heroRevealOrder.indexOf(name) * settings.heroStepStagger;
    return {
      hidden: { opacity: 0, y: simplifyMotion ? 0 : 18, filter: simplifyMotion ? 'blur(0px)' : 'blur(5px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay, duration: simplifyMotion ? 0 : settings.heroStepDuration, ease: [0.22, 1, 0.36, 1] as const } },
    };
  };

  const registerButton = (id: string, element: HTMLButtonElement | null) => {
    if (element) cardButtonsRef.current.set(id, element);
    else cardButtonsRef.current.delete(id);
  };

  const selectCard = (card: CardData) => {
    if (isClosingCard || pendingOpenCard || openedCard || foldMode !== 'spread') return;
    if (raisedCard !== card.id) {
      setRaisedCard(card.id);
      return;
    }
    const button = cardButtonsRef.current.get(card.id);
    if (!button) return;
    openingScrollRef.current = window.scrollY;
    pageOverflowRef.current = {
      body: document.body.style.overflow,
      document: document.documentElement.style.overflow,
    };
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    setFoldMode('fold-others');
    setPendingOpenCard({ card, rect: button.getBoundingClientRect() });
  };

  const onCardClose = () => {
    if (!openedCard || deckReturnTimerRef.current !== null) return;
    setOpenedCard(null);
    setFoldMode('folded');
    setIsClosingCard(false);
    deckReturnTimerRef.current = window.setTimeout(() => {
      deckReturnTimerRef.current = null;
      setFoldMode('spread');
      setRaisedCard(null);
      const previous = pageOverflowRef.current;
      if (previous) {
        document.body.style.overflow = previous.body;
        document.documentElement.style.overflow = previous.document;
        pageOverflowRef.current = null;
      }
      window.scrollTo({ top: openingScrollRef.current, behavior: 'instant' });
      requestAnimationFrame(() => {
        openedCard && cardButtonsRef.current.get(openedCard.card.id)?.focus({ preventScroll: true });
      });
    }, foldDuration * 1000);
  };

  const hero = (
    <motion.div
      variants={heroSteps}
      initial={heroInitial}
      animate={simplifyMotion || revealed ? 'visible' : 'hidden'}
      className="homepage-deck-hero-inner"
      style={!simplifyMotion && enabled ? { scale: heroScale, opacity: heroOpacity } : undefined}
    >
      <motion.div variants={heroStep('logo')} className="homepage-deck-logo-wrap"><Image src="/assets/branding/carnival-logo-transparent.png" alt="Livestock Carnival" width={220} height={166} priority className="h-[72px] w-auto object-contain sm:h-[108px]" /></motion.div>
      <motion.p variants={heroStep('eyebrow')} className="homepage-deck-eyebrow"><span />Federal Republic of Nigeria <i aria-hidden="true">·</i> Official Carnival &amp; Expo<span /></motion.p>
      <motion.h1 variants={heroStep('title')} className="homepage-deck-title">Welcome to the <span>National Livestock Carnival</span></motion.h1>
      <motion.p variants={heroStep('intro')} className="homepage-deck-intro">Explore championship livestock, Nigerian culture, live performances, festival food and the carnival grounds. Scroll through the cards to discover what’s waiting for you.</motion.p>
      <motion.div className="homepage-deck-scroll-cue" style={{ opacity: enabled && !simplifyMotion ? cueOpacity : 1 }} aria-hidden="true"><span>SCROLL TO EXPLORE</span><i /></motion.div>
    </motion.div>
  );

  if (!enabled) {
    return <section className="homepage-hero relative px-4 pb-10 pt-20 sm:px-7 sm:pb-12 sm:pt-28 lg:px-10 lg:pt-32"><div aria-hidden="true" className="homepage-hero-glow" /><div className="mx-auto max-w-[1440px] text-center">{hero}</div></section>;
  }

  const startOffset = stackOffset;
  const initialLift = Math.min(viewportHeight * 0.9, startOffset + viewportHeight * 0.56);

  return (
    <section
      ref={sceneRef}
      aria-label="Carnival highlights"
      className={`homepage-deck-runway${simplifyMotion ? ' is-reduced-motion' : ''}${lowPowerDevice ? ' is-low-power' : ''}`}
      style={{ height: simplifyMotion ? 'auto' : `${settings.sceneLengthVh}vh`, '--homepage-background-intensity': String(settings.heroBackgroundIntensity / 10) } as React.CSSProperties}
    >
      <div className="homepage-deck-scene">
        <motion.div className="homepage-deck-atmosphere" style={{ opacity: simplifyMotion ? 1 : atmosphereOpacity }} aria-hidden="true" />
        <div className="homepage-deck-hero">{hero}</div>
        {!simplifyMotion && <motion.p className="homepage-deck-prompt" style={{ opacity: promptOpacity, scale: promptScale }} aria-hidden="true"><span>PICK A CARD AND</span> <strong>EXPLORE!</strong></motion.p>}
        <motion.div className="homepage-deck-fan" style={{ y: simplifyMotion ? 0 : deckY, scale: simplifyMotion ? 1 : deckScale, opacity: simplifyMotion ? 1 : deckOpacity }}>
          <motion.div
            className="homepage-deck-fan-rise"
            initial={simplifyMotion ? false : { y: initialLift, opacity: 0 }}
            animate={simplifyMotion || revealed ? { y: 0, opacity: 1 } : { y: initialLift, opacity: 0 }}
            transition={{ duration: simplifyMotion ? 0 : settings.riseDuration, delay: simplifyMotion ? 0 : settings.riseDelay, ease: [0.22, 1, 0.36, 1] }}
          >
            {cards.map((card, index) => <DeckCard key={card.id} card={card} index={index} count={cards.length} progress={scrollYProgress} settings={settings} mobile={isMobile} viewportWidth={viewportWidth} raised={raisedCard === card.id} folded={foldMode === 'folded' || (foldMode === 'fold-others' && raisedCard !== card.id)} foldDuration={foldDuration} reducedMotion={simplifyMotion} registerButton={registerButton} onSelect={selectCard} />)}
          </motion.div>
        </motion.div>
        <motion.section
          className="homepage-deck-magazine"
          style={{ y: simplifyMotion ? 0 : magazineY, backgroundColor: magazine.backgroundColor, borderColor: `${magazine.accentColor}55` }}
          aria-labelledby="homepage-deck-magazine-title"
        >
          <div className="homepage-deck-magazine-copy">
            <HomepageMagazineHeading eyebrow={magazine.eyebrow} title={magazine.title} intro={magazine.intro} accentColor={magazine.accentColor} titleId="homepage-deck-magazine-title" compact />
            {leadStory?.image && (
              <Link href={HOMEPAGE_MAGAZINE_DESTINATIONS[leadStory.slug] ?? '/'} className="homepage-deck-magazine-feature group">
                <Image src={leadStory.image} alt="" fill sizes="(max-width: 767px) 100vw, 84vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
                <span className="homepage-deck-magazine-feature-copy">
                  <span className="homepage-deck-magazine-feature-eyebrow">{leadStory.eyebrow}</span>
                  <span className="homepage-deck-magazine-feature-title">{leadStory.title}</span>
                  <span className="homepage-deck-magazine-feature-body">{leadStory.body}</span>
                </span>
              </Link>
            )}
          </div>
        </motion.section>
      </div>
      {isClosingCard && <div className="homepage-deck-return-shield" aria-hidden="true" />}
      <AnimatePresence>{openedCard && <OpenCard key={openedCard.card.id} card={openedCard.card} rect={openedCard.rect} duration={simplifyMotion ? 0.15 : settings.cardOpenDuration} closeDuration={simplifyMotion ? 0.15 : settings.cardCloseDuration} openStartScale={settings.cardOpenStartScale} openEndScale={settings.cardOpenEndScale} closeStartScale={settings.cardCloseStartScale} closeEndScale={settings.cardCloseEndScale} expandedScale={isMobile ? settings.expandedCardScaleMobile : settings.expandedCardScaleDesktop} mobile={isMobile} onClosing={() => setIsClosingCard(true)} onClose={onCardClose} />}</AnimatePresence>
    </section>
  );
}
