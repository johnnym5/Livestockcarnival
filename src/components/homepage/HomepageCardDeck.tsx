'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { DEFAULT_HOMEPAGE_MOTION, normalizeHomepageMotion, type HomepageMotionSettings } from '@/lib/homepageMotion';
import type { CardData } from '@/lib/homepageCards';
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
  const opacity = useTransform(progress, [0, cardFanStart, cardFanEnd, settings.fanHoldEndProgress, settings.magazineEndProgress], [1, 0.82, 1, 1, 0]);
  return (
    <motion.div
      className="homepage-deck-card-position"
      style={{ x: reducedMotion ? normalizedOffset * (mobile ? 22 : 72) : x, y: reducedMotion ? Math.abs(normalizedOffset) * 8 : localY, rotate: reducedMotion ? normalizedOffset * (mobile ? 12 : 16) : rotate, opacity: reducedMotion ? 1 : opacity, zIndex: raised ? 1000 : 100 + index }}
    >
      <motion.button
        ref={(element) => registerButton(card.id, element)}
        type="button"
        data-homepage-deck-card={card.id}
        aria-label={`Select ${card.title}; select again to open`}
        aria-pressed={raised}
        onClick={() => onSelect(card)}
        animate={{ scale: raised ? 1.045 : 1, y: raised ? -24 : 0 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className="homepage-deck-card"
        style={{ background: coverGradient(card.coverBg), borderColor: card.accentColor, boxShadow: `0 14px 35px ${card.accentColor}33` }}
      >
        <Image src="/assets/branding/carnival-logo-transparent.png" alt="" width={118} height={90} className="homepage-deck-logo" />
        <span className="homepage-deck-number" style={{ color: card.accentColor }}>{card.number}</span>
      </motion.button>
    </motion.div>
  );
}

function OpenCard({
  card,
  rect,
  duration,
  expandedScale,
  onClose,
}: {
  card: CardData;
  rect: DOMRect;
  duration: number;
  expandedScale: number;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const safeDuration = Math.max(0.1, duration);

  useEffect(() => {
    const scrollY = window.scrollY;
    const previousStyles = {
      bodyOverflow: document.body.style.overflow,
      documentOverflow: document.documentElement.style.overflow,
    };
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
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
      document.body.style.overflow = previousStyles.bodyOverflow;
      document.documentElement.style.overflow = previousStyles.documentOverflow;
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const start = { left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: 18 };
  const expandedWidth = window.innerWidth * expandedScale;
  const expandedHeight = window.innerHeight * expandedScale;
  const full = { left: (window.innerWidth - expandedWidth) / 2, top: (window.innerHeight - expandedHeight) / 2, width: expandedWidth, height: expandedHeight, borderRadius: 0 };

  return createPortal((
    <div className="homepage-deck-modal-layer" role="presentation">
      <motion.div className="homepage-deck-backdrop" initial={{ opacity: 0 }} animate={{ opacity: closing ? 0 : 1 }} transition={{ duration: safeDuration * 0.5 }} />
      <motion.div
        role="dialog"
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby="homepage-open-card-title"
        className="homepage-deck-open-card"
        initial={start}
        animate={closing ? start : full}
        transition={{ duration: safeDuration, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => { if (closing) onClose(); }}
        style={{ perspective: 1600 }}
      >
        <motion.div className="homepage-deck-open-inner" initial={{ rotateY: 0 }} animate={{ rotateY: closing ? 0 : 180 }} transition={{ duration: safeDuration, ease: [0.3, 0.05, 0.2, 1] }}>
          <div className="homepage-deck-open-face homepage-deck-open-front" style={{ background: coverGradient(card.coverBg), borderColor: card.accentColor }}>
            <Image src="/assets/branding/carnival-logo-transparent.png" alt="Livestock Carnival" width={220} height={166} className="homepage-deck-open-logo" />
            <span style={{ color: card.accentColor }}>{card.number}</span>
          </div>
          <div className="homepage-deck-open-face homepage-deck-open-back" style={{ borderColor: card.accentColor }}>
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
            <button ref={closeButtonRef} type="button" onClick={() => setClosing(true)} aria-label="Close card" className="homepage-deck-close"><X aria-hidden="true" size={22} /></button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  ), document.body);
}

export default function HomepageCardDeck({ cards, magazine, enabled }: HomepageCardDeckProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const cardButtonsRef = useRef(new Map<string, HTMLButtonElement>());
  const openingScrollRef = useRef(0);
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_MOTION);
  const [revealed, setRevealed] = useState(false);
  const [raisedCard, setRaisedCard] = useState<string | null>(null);
  const [openedCard, setOpenedCard] = useState<{ card: CardData; rect: DOMRect } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [lowPowerDevice, setLowPowerDevice] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1024);
  const reducedMotion = useReducedMotion();
  const simplifyMotion = Boolean(reducedMotion || lowPowerDevice);
  const viewportHeight = useWindowHeight();
  const stickyHeaderHeight = isMobile ? 56 : 72;
  const sceneEndPercent = 100 - (stickyHeaderHeight / viewportHeight) * 100;
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', `end ${sceneEndPercent}%` as `end ${number}%`] });

  useEffect(() => {
    let active = true;
    void supabase.from('homepage_motion_settings').select('settings').eq('id', 1).maybeSingle().then(({ data }) => {
      if (active && data?.settings) setSettings(normalizeHomepageMotion(data.settings));
    });
    return () => { active = false; };
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
    if (!openedCard) return;
    openingScrollRef.current = window.scrollY;
  }, [openedCard]);

  const heroScale = useTransform(scrollYProgress, [0, settings.heroShrinkEnd], [isMobile ? settings.heroScaleOpeningMobile : settings.heroScaleOpeningDesktop, isMobile ? settings.heroScaleCoveredMobile : settings.heroScaleCoveredDesktop]);
  const heroOpacity = useTransform(scrollYProgress, [0, settings.fanStartProgress, settings.fanEndProgress], [1, 1, 0.12]);
  const mobileHeroBlurLimit = lowPowerDevice ? 1 : 3;
  const heroBlur = useTransform(scrollYProgress, [0, settings.heroShrinkEnd], [0, isMobile ? Math.min(mobileHeroBlurLimit, settings.heroBlur) : settings.heroBlur]);
  const promptOpacity = useTransform(scrollYProgress, [settings.promptStartProgress, settings.promptEndProgress, settings.fanHoldEndProgress, settings.magazineEndProgress], [0, 1, 1, 0]);
  const promptBlur = useTransform(scrollYProgress, [settings.promptStartProgress, settings.promptEndProgress, settings.fanHoldEndProgress, settings.magazineEndProgress], [5, 0, 0, isMobile || lowPowerDevice ? 1 : 2]);
  const promptScale = useTransform(scrollYProgress, [settings.promptStartProgress, settings.promptEndProgress, settings.fanHoldEndProgress, settings.magazineEndProgress], [0.88, 1, 1, 0.75]);
  const cueOpacity = useTransform(scrollYProgress, [0, settings.fanStartProgress * 0.45, settings.fanStartProgress], [1, 0.75, 0]);
  const stackOffset = settings.stackStartY * viewportHeight * (isMobile ? 0.7 : 1);
  const fanVerticalLift = viewportHeight * (isMobile ? 0.1 : 0.15);
  const deckY = useTransform(scrollYProgress, [0, settings.fanStartProgress, settings.fanEndProgress, settings.fanHoldEndProgress, settings.magazineEndProgress], [stackOffset, stackOffset, -fanVerticalLift, -fanVerticalLift, stackOffset]);
  const restackStart = settings.fanHoldEndProgress + (settings.magazineEndProgress - settings.fanHoldEndProgress) * settings.magazineRestackAt;
  const deckScale = useTransform(scrollYProgress, [0, settings.fanStartProgress, settings.fanEndProgress, restackStart, settings.magazineEndProgress], [isMobile ? settings.stackScaleMobile : settings.stackScaleDesktop, isMobile ? settings.stackScaleMobile : settings.stackScaleDesktop, isMobile ? settings.fanScaleMobile : settings.fanScaleDesktop, (isMobile ? settings.stackScaleMobile : settings.stackScaleDesktop) * settings.magazineScale, (isMobile ? settings.stackScaleMobile : settings.stackScaleDesktop) * settings.magazineScale]);
  const deckBlur = useTransform(scrollYProgress, [settings.fanHoldEndProgress, settings.magazineEndProgress], [0, isMobile || lowPowerDevice ? settings.magazineBlurMobile : settings.magazineBlurDesktop]);
  const magazineY = useTransform(scrollYProgress, [settings.fanHoldEndProgress, settings.magazineEndProgress], [viewportHeight, 0]);
  const magazineOpacity = useTransform(scrollYProgress, [settings.fanHoldEndProgress, settings.fanHoldEndProgress + 0.04], [0, 1]);
  const heroFilter = useTransform(heroBlur, (value) => `blur(${value}px)`);
  const promptFilter = useTransform(promptBlur, (value) => `blur(${value}px)`);
  const deckFilter = useTransform(deckBlur, (value) => `blur(${value}px)`);
  const deckOpacity = useTransform(scrollYProgress, [settings.magazineEndProgress - 0.04, settings.magazineEndProgress], [1, 0]);
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
    if (raisedCard !== card.id) {
      setRaisedCard(card.id);
      return;
    }
    const button = cardButtonsRef.current.get(card.id);
    if (!button) return;
    openingScrollRef.current = window.scrollY;
    setOpenedCard({ card, rect: button.getBoundingClientRect() });
  };

  const onCardClose = () => {
    setOpenedCard(null);
    setRaisedCard(null);
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: openingScrollRef.current, behavior: 'instant' })));
    requestAnimationFrame(() => cardButtonsRef.current.get(openedCard?.card.id ?? '')?.focus({ preventScroll: true }));
  };

  const hero = (
    <motion.div
      variants={heroSteps}
      initial={heroInitial}
      animate={simplifyMotion || revealed ? 'visible' : 'hidden'}
      className="homepage-deck-hero-inner"
      style={!simplifyMotion && enabled ? { scale: heroScale, opacity: heroOpacity, filter: heroFilter } : undefined}
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
        <div className="homepage-deck-hero">{hero}</div>
        {!simplifyMotion && <motion.p className="homepage-deck-prompt" style={{ opacity: promptOpacity, scale: promptScale, filter: promptFilter }} aria-hidden="true"><span>PICK A CARD AND</span> <strong>EXPLORE!</strong></motion.p>}
        <motion.div className="homepage-deck-fan" style={{ y: simplifyMotion ? 0 : deckY, scale: simplifyMotion ? 1 : deckScale, filter: simplifyMotion ? 'none' : deckFilter, opacity: simplifyMotion ? 1 : deckOpacity }}>
          <motion.div
            className="homepage-deck-fan-rise"
            initial={simplifyMotion ? false : { y: initialLift, opacity: 0 }}
            animate={simplifyMotion || revealed ? { y: 0, opacity: 1 } : { y: initialLift, opacity: 0 }}
            transition={{ duration: simplifyMotion ? 0 : settings.riseDuration, delay: simplifyMotion ? 0 : settings.riseDelay, ease: [0.22, 1, 0.36, 1] }}
          >
            {cards.map((card, index) => <DeckCard key={card.id} card={card} index={index} count={cards.length} progress={scrollYProgress} settings={settings} mobile={isMobile} viewportWidth={viewportWidth} raised={raisedCard === card.id} reducedMotion={simplifyMotion} registerButton={registerButton} onSelect={selectCard} />)}
          </motion.div>
        </motion.div>
        <motion.section
          className="homepage-deck-magazine"
          aria-label="Magazine highlights"
          style={{ y: simplifyMotion ? 0 : magazineY, opacity: simplifyMotion ? 0 : magazineOpacity, backgroundColor: magazine.backgroundColor, borderColor: `${magazine.accentColor}55` }}
        >
          <div className="homepage-deck-magazine-copy">
            <p style={{ color: magazine.accentColor }}>{magazine.eyebrow}</p>
            <h2>{magazine.title}</h2>
            <span>{magazine.intro}</span>
          </div>
        </motion.section>
      </div>
      {simplifyMotion && <section className="homepage-deck-static-magazine" style={{ backgroundColor: magazine.backgroundColor, borderColor: `${magazine.accentColor}55` }}><div><p style={{ color: magazine.accentColor }}>{magazine.eyebrow}</p><h2>{magazine.title}</h2><span>{magazine.intro}</span></div></section>}
      <AnimatePresence>{openedCard && <OpenCard key={openedCard.card.id} card={openedCard.card} rect={openedCard.rect} duration={simplifyMotion ? 0.15 : settings.flipDuration} expandedScale={isMobile ? settings.expandedCardScaleMobile : settings.expandedCardScaleDesktop} onClose={onCardClose} />}</AnimatePresence>
    </section>
  );
}
