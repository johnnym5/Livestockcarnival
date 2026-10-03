'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimationControls, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
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
  viewportHeight,
  selected,
  focusActive,
  flipped,
  returning,
  reducedMotion,
  registerButton,
  onSelect,
  onClose,
  onReturnComplete,
}: {
  card: CardData;
  index: number;
  count: number;
  progress: MotionValue<number>;
  settings: HomepageMotionSettings;
  mobile: boolean;
  viewportWidth: number;
  viewportHeight: number;
  selected: boolean;
  focusActive: boolean;
  flipped: boolean;
  returning: boolean;
  reducedMotion: boolean;
  registerButton: (id: string, element: HTMLButtonElement | null) => void;
  onSelect: (card: CardData) => void;
  onClose: () => void;
  onReturnComplete: () => void;
}) {
  const [showBack, setShowBack] = useState(false);
  const showBackRef = useRef(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const flipControls = useAnimationControls();
  const center = (count - 1) / 2;
  const offset = index - center;
  const normalizedOffset = center === 0 ? 0 : offset / center;
  const spread = mobile ? settings.fanSpreadMobile : settings.fanSpreadDesktop;
  const spreadPixels = Math.min(viewportWidth * 0.31, spread * (mobile ? 2.5 : 4.1));
  const restackStart = settings.fanHoldEndProgress + (settings.magazineEndProgress - settings.fanHoldEndProgress) * settings.magazineRestackAt;
  const fanSpan = settings.fanEndProgress - settings.fanStartProgress;
  const cardRank = count <= 1 ? 0 : index / (count - 1);
  const cardFanStart = settings.fanStartProgress + fanSpan * cardRank * 0.35;
  const cardFanEnd = settings.fanStartProgress + fanSpan * (0.65 + cardRank * 0.35);
  const cardStages = [0, cardFanStart, cardFanEnd, restackStart, settings.magazineEndProgress];
  const x = useTransform(progress, cardStages, [0, 0, normalizedOffset * spreadPixels, normalizedOffset * spreadPixels, 0]);
  const rotate = useTransform(progress, cardStages, [0, 0, normalizedOffset * (mobile ? 17 : 20), normalizedOffset * (mobile ? 17 : 20), 0]);
  const localY = useTransform(progress, cardStages, [Math.abs(normalizedOffset) * settings.stackPeek * 22, Math.abs(normalizedOffset) * settings.stackPeek * 22, Math.abs(normalizedOffset) * (mobile ? 15 : 20), Math.abs(normalizedOffset) * (mobile ? 15 : 20), 0]);
  const opacity = useTransform(progress, [0, cardFanStart, cardFanEnd, settings.fanHoldEndProgress, restackStart, settings.magazineEndProgress], [1, 0.82, 1, 1, 1, 0]);
  const finalOpacity = useTransform(opacity, (value) => value * (focusActive && !selected ? 0.68 : 1));
  const lift = mobile ? settings.cardFocusLiftMobile : settings.cardFocusLiftDesktop;
  const requestedScale = mobile ? settings.cardFocusScaleMobile : settings.cardFocusScaleDesktop;
  const cardWidth = mobile ? Math.min(viewportWidth * 0.7, 300) : Math.min(Math.max(viewportWidth * 0.4, 300), 560);
  const cardHeight = cardWidth * (mobile ? 16 / 9 : 9 / 16);
  const cardRotation = normalizedOffset * (mobile ? 17 : 20) * (selected ? 0 : 1);
  const radians = Math.abs(cardRotation) * Math.PI / 180;
  const rotatedWidth = cardWidth * Math.cos(radians) + cardHeight * Math.sin(radians);
  const rotatedHeight = cardHeight * Math.cos(radians) + cardWidth * Math.sin(radians);
  const fitScale = Math.min(viewportWidth * 0.94 / rotatedWidth, Math.max(160, viewportHeight - (mobile ? 56 : 72) - 36) / rotatedHeight);
  const scale = Math.min(requestedScale, Math.max(1, fitScale));
  const focusDuration = reducedMotion ? 0 : (returning ? settings.cardReturnDuration : settings.cardFlipDuration);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    const targetSide = flipped;
    const halfDuration = focusDuration / 2;

    const changeSide = async () => {
      if (showBackRef.current !== targetSide) {
        if (reducedMotion) {
          flipControls.set({ scaleX: 0.01 });
        } else {
          await flipControls.start({ scaleX: 0.01, transition: { duration: halfDuration, ease: [0.22, 1, 0.36, 1] } });
          if (cancelled) return;
        }

        showBackRef.current = targetSide;
        setShowBack(targetSide);
        if (!reducedMotion) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }

      if (reducedMotion) {
        flipControls.set({ scaleX: 1 });
      } else {
        await flipControls.start({ scaleX: 1, transition: { duration: halfDuration, ease: [0.22, 1, 0.36, 1] } });
      }

      if (!cancelled && returning) onReturnComplete();
    };

    void changeSide();
    return () => {
      cancelled = true;
      flipControls.stop();
    };
  }, [selected, flipped, returning, reducedMotion, focusDuration, onReturnComplete, flipControls]);

  useEffect(() => {
    if (selected && showBack) closeButtonRef.current?.focus({ preventScroll: true });
  }, [selected, showBack]);

  return (
    <motion.div
      className="homepage-deck-card-position"
      style={{
        x: reducedMotion ? normalizedOffset * (mobile ? 22 : 72) : x,
        y: reducedMotion ? Math.abs(normalizedOffset) * 8 : localY,
        rotate: selected ? 0 : reducedMotion ? normalizedOffset * (mobile ? 12 : 16) : rotate,
        opacity: reducedMotion ? 1 : finalOpacity,
        zIndex: selected ? 1000 : 100 + index,
        filter: focusActive && !selected ? `blur(${settings.cardFocusBlur}px)` : 'blur(0px)',
        pointerEvents: focusActive && !selected ? 'none' : 'auto',
      }}
    >
      <motion.div
        className="homepage-deck-card-focus"
        animate={{ y: selected && !reducedMotion ? -lift : 0, scale: selected && !reducedMotion ? scale : 1 }}
        transition={{ duration: focusDuration, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="homepage-deck-card-flip" initial={false} animate={flipControls}>
          {!showBack ? <button
            ref={(element) => registerButton(card.id, element)}
            type="button"
            data-homepage-deck-card={card.id}
            aria-label={`Open ${card.title}`}
            aria-pressed={selected}
            aria-hidden={showBack}
            tabIndex={showBack ? -1 : 0}
            disabled={focusActive && !selected}
            onClick={() => onSelect(card)}
            className="homepage-deck-card homepage-deck-card-front"
            style={{ background: coverGradient(card.coverBg), borderColor: card.accentColor, boxShadow: `inset 0 1px 0 rgba(255,255,255,.14), 0 16px 36px rgba(10,20,12,.22), 0 14px 35px ${card.accentColor}33` }}
          >
            <Image src="/assets/branding/carnival-logo-transparent.png" alt="" width={118} height={90} className="homepage-deck-logo" />
            <span className="homepage-deck-card-label">{card.pageTitle || card.title}</span>
            <span className="homepage-deck-number" style={{ color: card.accentColor }}>{card.number}</span>
          </button> : <div
            className="homepage-deck-card homepage-deck-card-back"
            aria-hidden={!showBack}
            style={{ borderColor: card.accentColor }}
          >
            <div className="homepage-deck-card-back-image">
              <Image src={card.image} alt="" fill sizes="(max-width: 767px) 70vw, 40vw" priority className="object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#06150D]/95 via-[#06150D]/45 to-transparent" />
            </div>
            <div className="homepage-deck-card-back-copy">
              <p className="homepage-deck-card-back-eyebrow">{card.eyebrow}</p>
              <h2 className="homepage-deck-card-back-title">{card.title}</h2>
              <p className="homepage-deck-card-back-body">{card.body}</p>
              <Link href={card.link} tabIndex={showBack ? 0 : -1} className="homepage-deck-card-back-link">
                {card.cta}<ArrowRight aria-hidden="true" size={14} />
              </Link>
            </div>
            <span className="homepage-deck-card-back-number">{card.number}</span>
            <button ref={closeButtonRef} type="button" onClick={onClose} tabIndex={showBack ? 0 : -1} aria-label="Close card" className="homepage-deck-card-close"><X aria-hidden="true" size={18} /></button>
          </div>}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function HomepageCardDeck({ cards, magazine, leadStory, enabled }: HomepageCardDeckProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const cardButtonsRef = useRef(new Map<string, HTMLButtonElement>());
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_MOTION);
  const [revealed, setRevealed] = useState(false);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [isClosingCard, setIsClosingCard] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lowPowerDevice, setLowPowerDevice] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1024);
  const reducedMotion = useReducedMotion();
  const simplifyMotion = Boolean(reducedMotion);
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
    if (!focusedCardId || isClosingCard) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsClosingCard(true);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [focusedCardId, isClosingCard]);

  const heroScale = useTransform(scrollYProgress, [0, settings.cardScrollStart, settings.heroShrinkEnd], [isMobile ? settings.heroScaleOpeningMobile : settings.heroScaleOpeningDesktop, isMobile ? settings.heroScaleOpeningMobile : settings.heroScaleOpeningDesktop, isMobile ? settings.heroScaleCoveredMobile : settings.heroScaleCoveredDesktop]);
  const heroOpacity = useTransform(scrollYProgress, [0, settings.fanStartProgress, settings.fanEndProgress], [1, 1, 0.12]);
  const heroBlur = useTransform(scrollYProgress, [settings.cardScrollStart, settings.heroShrinkEnd], [0, settings.heroBlur], { clamp: true });
  const heroBlurFilter = useTransform(heroBlur, (value) => `blur(${value}px)`);
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
  const deckBlur = useTransform(scrollYProgress, [settings.fanHoldEndProgress, settings.magazineEndProgress], [0, isMobile ? settings.magazineBlurMobile : settings.magazineBlurDesktop], { clamp: true });
  const deckBlurFilter = useTransform(deckBlur, (value) => `blur(${value}px)`);
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
    if (focusedCardId) return;
    setFocusedCardId(card.id);
    setIsClosingCard(false);
  };
  const finishCardReturn = useCallback(() => {
    const id = focusedCardId;
    setFocusedCardId(null);
    setIsClosingCard(false);
    if (id) requestAnimationFrame(() => cardButtonsRef.current.get(id)?.focus({ preventScroll: true }));
  }, [focusedCardId]);

  const hero = (
    <motion.div
      variants={heroSteps}
      initial={heroInitial}
      animate={simplifyMotion || revealed ? 'visible' : 'hidden'}
      className="homepage-deck-hero-inner"
      style={!simplifyMotion && enabled ? { scale: heroScale, opacity: heroOpacity, filter: heroBlurFilter } : undefined}
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

  const initialLift = Math.min(viewportHeight * 0.9, stackOffset + viewportHeight * 0.56);
  const focusIsActive = focusedCardId !== null;

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
        <motion.div className="homepage-deck-fan" style={{ y: simplifyMotion ? 0 : deckY, scale: simplifyMotion ? 1 : deckScale, opacity: simplifyMotion ? 1 : deckOpacity, filter: simplifyMotion ? undefined : deckBlurFilter }}>
          <motion.div
            className="homepage-deck-fan-rise"
            initial={simplifyMotion ? false : { y: initialLift, opacity: 0 }}
            animate={simplifyMotion || revealed ? { y: 0, opacity: 1 } : { y: initialLift, opacity: 0 }}
            transition={{ duration: simplifyMotion ? 0 : settings.riseDuration, delay: simplifyMotion ? 0 : settings.riseDelay, ease: [0.22, 1, 0.36, 1] }}
          >
            {cards.map((card, index) => <DeckCard
              key={card.id}
              card={card}
              index={index}
              count={cards.length}
              progress={scrollYProgress}
              settings={settings}
              mobile={isMobile}
              viewportWidth={viewportWidth}
              viewportHeight={viewportHeight}
              selected={focusedCardId === card.id}
              focusActive={focusIsActive}
              flipped={focusedCardId === card.id && !isClosingCard}
              returning={focusedCardId === card.id && isClosingCard}
              reducedMotion={simplifyMotion}
              registerButton={registerButton}
              onSelect={selectCard}
              onClose={() => setIsClosingCard(true)}
              onReturnComplete={finishCardReturn}
            />)}
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
    </section>
  );
}
