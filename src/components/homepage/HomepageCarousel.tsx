'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import type { CardData } from '@/lib/homepageCards';

function CardDetailsDialog({ card, onClose }: { card: CardData; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="homepage-card-title"
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
      className="homepage-card-dialog m-auto w-[min(92vw,900px)] max-w-none overflow-hidden rounded-[1.5rem] border border-[#D8C48A] bg-[#FBFBFA] p-0 text-[#111827] shadow-[0_32px_100px_rgba(3,10,5,0.4)] backdrop:bg-[#07130D]/65 backdrop:backdrop-blur-sm"
    >
      <div className="grid md:min-h-[460px] md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[230px] bg-[#092617] md:min-h-full">
          <Image src={card.image} alt={card.title} fill sizes="(max-width: 767px) 92vw, 480px" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06150D]/50 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 rounded-full border border-white/35 bg-black/25 px-3 py-1 text-xs font-bold tracking-[0.2em] text-white backdrop-blur-sm">{card.number}</span>
        </div>
        <div className="relative flex flex-col p-6 sm:p-9 md:p-10">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close card details"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E6E1] bg-white text-[#1E4D38] transition hover:bg-[#EDF3EC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D6B1B]"
          ><X aria-hidden="true" size={20} /></button>
          <div className="pr-12">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8D6B1B] sm:text-xs">{card.eyebrow}</p>
            <h2 id="homepage-card-title" className="mt-3 text-2xl font-black leading-tight sm:text-3xl">{card.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4B5563] sm:text-base">{card.body}</p>
          </div>
          <Link
            href={card.link}
            onClick={() => dialogRef.current?.close()}
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 self-start rounded-full bg-[#0D4027] px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-[#155334] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >{card.cta}<ArrowRight aria-hidden="true" size={16} /></Link>
        </div>
      </div>
    </dialog>
  );
}

export default function HomepageCarousel({ cards }: { cards: CardData[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      const center = rail.scrollLeft + rail.clientWidth / 2;
      const slides = Array.from(rail.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
      let closest = 0;
      let distance = Number.POSITIVE_INFINITY;
      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const nextDistance = Math.abs(center - slideCenter);
        if (nextDistance < distance) { distance = nextDistance; closest = index; }
      });
      setActiveIndex(closest);
    };
    rail.addEventListener('scroll', update, { passive: true });
    update();
    return () => rail.removeEventListener('scroll', update);
  }, [cards.length]);

  useEffect(() => {
    if (selectedCard) return;
    openerRef.current?.focus({ preventScroll: true });
    openerRef.current = null;
  }, [selectedCard]);

  const scrollTo = (index: number) => {
    const rail = railRef.current;
    const slide = rail?.querySelectorAll<HTMLElement>('[data-carousel-slide]')[index];
    if (rail && slide) rail.scrollTo({ left: slide.offsetLeft - (rail.clientWidth - slide.offsetWidth) / 2, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
  };

  return (
    <div className="homepage-carousel">
      <div ref={railRef} className="homepage-carousel-rail" aria-label="Carnival highlights">
        {cards.map((card, index) => (
          <article key={card.id} data-carousel-slide className="homepage-carousel-slide">
            <button
              type="button"
              onClick={(event) => { openerRef.current = event.currentTarget; setSelectedCard(card); }}
              aria-label={`Explore ${card.title}`}
              aria-haspopup="dialog"
              className="homepage-carousel-card group"
            >
              <Image
                src={card.image}
                alt=""
                fill
                priority={index < 2}
                sizes="(max-width: 640px) 84vw, (max-width: 1024px) 68vw, 58vw"
                className="homepage-carousel-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06150D]/95 via-[#06150D]/25 to-transparent transition-opacity duration-300 group-hover:from-[#06150D]/90" />
              <span className="absolute left-5 top-5 rounded-full border border-white/50 bg-black/25 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-sm sm:left-7 sm:top-7">{card.number}</span>
              <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white sm:p-8 md:p-10">
                <p className="mb-2 max-w-2xl text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#F2C64B] sm:text-[11px] sm:tracking-[0.22em]">{card.eyebrow}</p>
                <h2 className="max-w-3xl text-xl font-black leading-tight sm:text-3xl md:text-4xl">{card.title}</h2>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/90 sm:text-xs">
                  Discover this experience <ArrowRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          </article>
        ))}
      </div>

      <div className="homepage-carousel-controls">
        <button type="button" onClick={() => scrollTo(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0} aria-label="Previous highlight" className="homepage-carousel-arrow"><ChevronLeft aria-hidden="true" size={19} /></button>
        <div className="flex items-center gap-2" aria-label={`Slide ${activeIndex + 1} of ${cards.length}`}>
          {cards.map((card, index) => <button key={card.id} type="button" onClick={() => scrollTo(index)} aria-label={`Show highlight ${index + 1}: ${card.title}`} aria-current={activeIndex === index ? 'true' : undefined} className={`homepage-carousel-dot ${activeIndex === index ? 'is-active' : ''}`} />)}
        </div>
        <span className="min-w-[58px] text-center font-mono text-[11px] font-bold tracking-[0.12em] text-[#526156]" aria-live="polite">{String(activeIndex + 1).padStart(2, '0')} <span className="text-[#B1B8B1]">/</span> {String(cards.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => scrollTo(Math.min(cards.length - 1, activeIndex + 1))} disabled={activeIndex === cards.length - 1} aria-label="Next highlight" className="homepage-carousel-arrow"><ChevronRight aria-hidden="true" size={19} /></button>
      </div>

      {selectedCard && <CardDetailsDialog card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
}
