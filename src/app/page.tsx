'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import HomepageCardDeck from '@/components/homepage/HomepageCardDeck';
import HomepageMagazine from '@/components/homepage/HomepageMagazine';
import { supabase } from '@/lib/supabase/client';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContent';
import { DEFAULT_HOMEPAGE_CARDS, mapCmsCard, type CardData } from '@/lib/homepageCards';
import { resolveHomepageMagazineStories } from '@/lib/homepageMagazine';
import { useSiteAnimation } from '@/components/SiteAnimationContext';

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
        <div className={siteAnimation.cardDeckEnabled ? 'pb-12 sm:pb-16' : ''}>
          <HomepageMagazine
            eyebrow={String(magazineContent.eyebrow)}
            title={String(magazineContent.title)}
            intro={String(magazineContent.intro)}
            stories={resolveHomepageMagazineStories(magazineContent)}
            accentColor={String(magazineContent.accentColor)}
          />
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
