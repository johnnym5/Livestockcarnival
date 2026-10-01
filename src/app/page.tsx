'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import HomepageCarousel from '@/components/homepage/HomepageCarousel';
import { supabase } from '@/lib/supabase/client';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContent';
import { DEFAULT_HOMEPAGE_CARDS, mapCmsCard, type CardData } from '@/lib/homepageCards';
import { useSiteAnimation } from '@/components/SiteAnimationContext';

function MagazineFeature({ card, index }: { card: CardData; index: number }) {
  const imageFirst = index % 2 === 0;

  return (
    <ScrollReveal direction={index % 2 === 0 ? 'left' : 'right'} duration={0.65} once>
      <article className="group grid min-h-[330px] overflow-hidden rounded-[1.5rem] border border-[#E0E3DC] bg-white shadow-[0_18px_55px_rgba(17,24,39,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_70px_rgba(17,24,39,0.14)] md:min-h-[380px] md:grid-cols-2">
        <div className={`relative min-h-[220px] overflow-hidden bg-[#E5E7E6] md:min-h-full ${imageFirst ? 'md:order-1' : 'md:order-2'}`}>
          <Image src={card.image} alt={card.title} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07150D]/35 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white/15" />
          <span className="absolute bottom-4 left-4 rounded-full border border-white/55 bg-[#07150D]/45 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-sm">{card.number}</span>
        </div>
        <div className={`flex flex-col justify-center px-6 py-8 sm:px-9 md:px-12 md:py-12 lg:px-16 ${imageFirst ? 'md:order-2' : 'md:order-1'}`}>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8D6B1B] sm:text-xs">{card.eyebrow}</p>
          <h3 className="mt-3 text-2xl font-black leading-tight text-[#111827] sm:text-3xl lg:text-4xl">{card.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-[#4B5563] sm:text-base">{card.body}</p>
          <Link href={card.link} className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1E4D38] transition-colors hover:text-[#8D6B1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4D38] sm:text-xs">
            {card.cta}<ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function Home() {
  const [cards, setCards] = useState<CardData[]>(DEFAULT_HOMEPAGE_CARDS);
  const [magazineContent, setMagazineContent] = useState(DEFAULT_SITE_CONTENT.magazine);
  const [contentReady, setContentReady] = useState(false);
  const siteAnimation = useSiteAnimation();

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      const [cardsResult, magazineResult] = await Promise.all([
        supabase.from('homepage_cards').select('*').eq('enabled', true).eq('published', true).order('position', { ascending: true }),
        supabase.from('site_page_content').select('content').eq('page_key', 'magazine').eq('published', true).maybeSingle(),
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
    <div id="home-page" data-home-ready={contentReady ? 'true' : 'false'} className="min-h-screen overflow-hidden bg-[#FBFBFA] text-[#111827]">
      <section className="homepage-hero relative px-4 pb-6 pt-16 sm:px-7 sm:pb-12 sm:pt-32 lg:px-10 lg:pb-16 lg:pt-36">
        <div aria-hidden="true" className="homepage-hero-glow" />
        <div className="relative mx-auto max-w-[1440px] text-center">
          <ScrollReveal direction="up" duration={0.55} once>
            <Image src="/assets/branding/carnival-logo-transparent.png" alt="Livestock Carnival" width={174} height={132} priority className="mx-auto h-[68px] w-auto object-contain sm:h-[96px]" />
            <p className="mx-auto mt-3 flex max-w-3xl items-center justify-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#8D6B1B] sm:text-xs sm:tracking-[0.22em]">
              <span className="hidden h-px w-10 bg-[#D7C58D] sm:block" />Federal Republic of Nigeria <span aria-hidden="true">·</span> Official Carnival &amp; Expo<span className="hidden h-px w-10 bg-[#D7C58D] sm:block" />
            </p>
            <h1 className="mx-auto mt-4 max-w-5xl text-[clamp(2.2rem,7vw,6.25rem)] font-black leading-[0.98] tracking-[-0.055em] text-[#111827]">
              Welcome to the <span className="text-[#D9A928]">National Livestock Carnival</span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#4B5563] sm:text-base md:text-lg">
              Explore championship livestock, Nigerian culture, live performances, festival food and the carnival grounds.
              <span className="hidden sm:inline"> Scroll through the highlights to discover what’s waiting for you.</span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {siteAnimation.cardDeckEnabled && (
        <section aria-label="Carnival highlights" className="homepage-carousel-section pb-16 sm:pb-20 lg:pb-24">
          <HomepageCarousel cards={cards} />
        </section>
      )}

      <section
        id="magazine-highlights"
        aria-labelledby="magazine-highlights-title"
        style={{ backgroundColor: String(magazineContent.backgroundColor), borderColor: `${String(magazineContent.accentColor)}55` }}
        className="border-t text-[#111827]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <ScrollReveal direction="up" duration={0.6} once>
            <div className="mb-9 max-w-3xl sm:mb-12">
              <p style={{ color: String(magazineContent.accentColor) }} className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.22em] sm:text-xs">{String(magazineContent.eyebrow)}</p>
              <h2 id="magazine-highlights-title" className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{String(magazineContent.title)}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#4B5563] sm:text-base">{String(magazineContent.intro)}</p>
            </div>
          </ScrollReveal>
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
