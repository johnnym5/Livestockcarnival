'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import HomepageCardDeck from '@/components/homepage/HomepageCardDeck';
import { supabase } from '@/lib/supabase/client';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContent';
import { DEFAULT_HOMEPAGE_CARDS, mapCmsCard, type CardData } from '@/lib/homepageCards';
import { useSiteAnimation } from '@/components/SiteAnimationContext';

function MagazineFeature({ card, index }: { card: CardData; index: number }) {
  const featureRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: featureRef, offset: ['start 92%', 'start 24%'] });
  const imageOpacity = useTransform(scrollYProgress, [0, 0.25, 0.55], [0, 1, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0.18, 0.48, 0.72], [0, 1, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.34, 0.62, 0.82], [0, 1, 1]);
  const contentY = useTransform(scrollYProgress, [0.34, 0.82], [22, 0]);

  return (
    <motion.article
      ref={featureRef}
      className="group relative isolate mx-auto aspect-[4/3] min-h-[470px] w-full max-w-[1440px] overflow-hidden rounded-[1.5rem] border border-[#D8C48A]/70 bg-[#07150D] shadow-[0_28px_80px_rgba(17,24,39,0.22),0_8px_22px_rgba(17,24,39,0.1)] md:aspect-[16/9] md:min-h-[500px] lg:max-h-[760px]"
      aria-label={`Magazine feature ${index + 1}: ${card.title}`}
    >
      <motion.div className="absolute inset-0" style={reducedMotion ? undefined : { opacity: imageOpacity }}>
        <Image src={card.image} alt={card.title} fill sizes="(max-width: 767px) 100vw, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
      </motion.div>
      <span className="absolute left-6 top-6 z-10 rounded-full border border-white/60 bg-[#07150D]/40 px-4 py-1.5 text-xs font-extrabold tracking-[0.18em] text-white backdrop-blur-sm sm:left-8 sm:top-8">{card.number || String(index + 1).padStart(2, '0')}</span>
      <motion.div
        className="absolute inset-0 z-10"
        style={reducedMotion ? undefined : { opacity: overlayOpacity }}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#06150D]/95 via-[#06150D]/72 to-transparent" />
        <div
          aria-hidden="true"
          className="absolute inset-0 backdrop-blur-[4px]"
          style={{
            maskImage: 'linear-gradient(to top, #000 0%, #000 42%, transparent 84%)',
            WebkitMaskImage: 'linear-gradient(to top, #000 0%, #000 42%, transparent 84%)',
          }}
        />
        <motion.div className="absolute inset-x-0 bottom-0 mx-auto flex h-full max-w-[1240px] flex-col justify-end px-6 pb-7 pt-20 sm:px-10 sm:pb-10 sm:pt-24 lg:px-12" style={reducedMotion ? undefined : { opacity: contentOpacity, y: contentY }}>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F2C349] [text-shadow:0_2px_8px_rgba(0,0,0,0.55)] sm:text-xs">{card.eyebrow}</p>
          <h3 className="mt-3 max-w-5xl text-3xl font-black leading-[1.02] text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.32),0_8px_24px_rgba(0,0,0,0.48)] sm:text-4xl md:text-5xl lg:text-6xl">{card.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,0.55)] sm:mt-4 sm:text-base lg:text-lg">{card.body}</p>
          <Link href={card.link} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:text-[#F2C349] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:mt-6 sm:text-xs">
            {card.cta}<ArrowRight aria-hidden="true" size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

export default function Home() {
  const [cards, setCards] = useState<CardData[]>(DEFAULT_HOMEPAGE_CARDS);
  const [magazineContent, setMagazineContent] = useState(DEFAULT_SITE_CONTENT.magazine);
  const [contentReady, setContentReady] = useState(false);
  const siteAnimation = useSiteAnimation();
  const reducedMotion = useReducedMotion();
  const magazineOverlapsDeck = siteAnimation.cardDeckEnabled && !reducedMotion;

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      const [cardsResult, magazineResult] = await Promise.all([
        supabase.from('homepage_cards').select('*').eq('enabled', true).eq('status', 'published').order('position', { ascending: true }),
        supabase.from('site_page_content').select('content').eq('page_key', 'magazine').eq('status', 'published').maybeSingle(),
      ]);
      if (!active) return;

      const rows = cardsResult.data;
      if (!cardsResult.error && rows && rows.length >= 3 && rows.length <= 10) {
        setCards(rows.map((row) => mapCmsCard(row as Record<string, unknown>)));
      }
      const magazine = magazineResult.data?.content;
      if (!magazineResult.error && magazine && typeof magazine === 'object') {
        setMagazineContent({ ...DEFAULT_SITE_CONTENT.magazine, ...(magazine as Record<string, unknown>) });
      }
      setContentReady(true);
      window.dispatchEvent(new Event('homepage:scene-ready'));
    };

    void loadContent();
    const fallback = window.setTimeout(() => {
      if (active) {
        setContentReady(true);
        window.dispatchEvent(new Event('homepage:scene-ready'));
      }
    }, 4500);

    return () => {
      active = false;
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div id="home-page" data-home-ready={contentReady ? 'true' : 'false'} className="min-h-screen overflow-x-clip bg-[#FBFBFA] text-[#111827]">
      <HomepageCardDeck
        cards={cards}
        enabled={siteAnimation.cardDeckEnabled}
        magazine={{
          eyebrow: String(magazineContent.eyebrow),
          title: String(magazineContent.title),
          intro: String(magazineContent.intro),
          backgroundColor: String(magazineContent.backgroundColor),
          accentColor: String(magazineContent.accentColor),
        }}
      />

      <section
        id="magazine-highlights"
        aria-labelledby="magazine-highlights-title"
        style={{ backgroundColor: String(magazineContent.backgroundColor), borderColor: `${String(magazineContent.accentColor)}55` }}
        className={`border-t text-[#111827] ${magazineOverlapsDeck ? '-mt-[18vh] relative z-10' : ''}`}
      >
        <div className={`mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 ${siteAnimation.cardDeckEnabled ? 'pt-0 pb-12 sm:pb-16' : 'py-16 sm:py-20 lg:py-24'}`}>
          {!siteAnimation.cardDeckEnabled && <ScrollReveal direction="up" duration={0.6} once>
            <div className="mb-9 max-w-3xl sm:mb-12">
              <p style={{ color: String(magazineContent.accentColor) }} className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.22em] sm:text-xs">{String(magazineContent.eyebrow)}</p>
              <h2 id="magazine-highlights-title" className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{String(magazineContent.title)}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#4B5563] sm:text-base">{String(magazineContent.intro)}</p>
            </div>
          </ScrollReveal>}
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
            {cards.map((card, index) => <MagazineFeature key={`magazine-${card.id}`} card={card} index={index} />)}
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden border-t border-[#E4B03A]/30 bg-[#08150B] py-16 text-white sm:py-20 lg:py-24">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(228,176,58,0.09)_0%,transparent_70%)]" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center sm:px-10">
          <span className="mb-4 inline-flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E4B03A] sm:text-xs sm:tracking-[0.26em]">
            <span className="h-px w-6 bg-[#E4B03A]/60 sm:w-8" />21 – 23 November 2026 · Abuja National Grounds<span className="h-px w-6 bg-[#E4B03A]/60 sm:w-8" />
          </span>
          <h2 className="mb-5 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">Join the Grand Celebration of Culture, Agribusiness &amp; Heritage</h2>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">Complimentary gate passes are available for all delegates, visitors, and families. Secure your passes and explore vendor booth bookings.</p>
          <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <a href="https://pass.livestockcarnival.ng" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E4B03A] px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-[#030A05] transition hover:bg-[#D4A030] sm:w-auto sm:px-8 sm:text-sm">Claim Free Gate Pass<ArrowRight aria-hidden="true" size={16} /></a>
            <a href="https://vendors.livestockcarnival.ng" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/25 bg-transparent px-6 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10 sm:w-auto sm:px-8 sm:text-sm">Exhibitor &amp; Vendor Booking</a>
            <Link href="/schedule" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 text-xs font-bold uppercase tracking-[0.12em] text-gray-200 transition hover:bg-white/10 sm:w-auto sm:px-8 sm:text-sm"><CalendarDays aria-hidden="true" size={16} />View 3-Day Program</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
