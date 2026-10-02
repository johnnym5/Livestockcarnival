'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { HOMEPAGE_MAGAZINE_DESTINATIONS, type HomepageMagazineStory } from '@/lib/homepageMagazine';

const layoutClasses = {
  wide: 'aspect-[16/10] min-h-[16rem] md:aspect-[16/7] md:min-h-0',
  square: 'aspect-square',
  tall: 'aspect-[4/5]',
  text: 'py-7',
  'text-large': 'min-h-[16rem] py-10 md:min-h-[18rem] md:py-12',
  'text-small': 'py-5',
  image: 'aspect-[4/3]',
};

function MagazineTile({ story, index }: { story: HomepageMagazineStory; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.45, 1, 1, 0.55]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.78, 1], [0.975, 1, 1, 0.985]);
  const isText = story.layout === 'text' || story.layout === 'text-large' || story.layout === 'text-small';
  const isImageOnly = story.layout === 'image';
  const isFeature = story.layout === 'wide' || story.layout === 'text-large';
  const href = HOMEPAGE_MAGAZINE_DESTINATIONS[story.slug] ?? '/';

  return (
    <motion.article
      ref={ref}
      style={reducedMotion ? undefined : { opacity, scale }}
      className={`${isText ? 'relative flex items-center' : 'group relative isolate overflow-hidden rounded-[0.4rem] border border-[#D9DED7] bg-[#E9ECE8]'} ${isFeature ? 'mb-6 w-full' : 'mb-5 inline-block w-full break-inside-avoid align-top'} ${layoutClasses[story.layout]}`}
    >
      <Link
        href={href}
        aria-label={`${story.title}. ${story.body}`}
        className={`${isText ? 'relative flex min-h-full w-full flex-col justify-center overflow-visible px-1 py-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4D38] md:px-0' : 'absolute inset-0 block overflow-hidden bg-[#13291D] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#D7A72E]'}`}
      >
        {!isText && story.image && (
          <>
            <Image
              src={story.image}
              alt=""
              fill
              sizes={story.layout === 'wide' ? '(max-width: 767px) 100vw, 66vw' : '(max-width: 767px) 100vw, 34vw'}
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] ${isImageOnly ? '' : 'opacity-90'}`}
            />
            {!isImageOnly && <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#07150D]/95 via-[#07150D]/25 to-transparent" />}
          </>
        )}

        {isText ? (
          <>
            <span className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#856312] sm:text-[10px]">{story.eyebrow}</span>
            <h3 className={`max-w-[38rem] font-black leading-[0.98] text-[#111827] ${story.layout === 'text-large' ? 'text-4xl sm:text-5xl lg:text-6xl' : story.layout === 'text-small' ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-3xl sm:text-4xl'}`}>{story.title}</h3>
            <p className={`mt-4 max-w-[34rem] leading-relaxed text-[#59645D] ${story.layout === 'text-small' ? 'text-sm sm:text-[0.95rem]' : 'text-sm sm:text-base'}`}>{story.body}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#1E4D38]">Explore this story <ArrowUpRight aria-hidden="true" size={15} /></span>
          </>
        ) : isImageOnly ? (
          <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-[#07150D]/75 via-transparent to-transparent p-5 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 sm:p-7">
            <span className="max-w-[80%] text-xl font-extrabold leading-tight text-white">{story.title}</span>
            <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-white" />
          </div>
        ) : (
          <div className={`absolute inset-0 flex flex-col justify-end p-5 text-white sm:p-7 ${story.layout === 'tall' ? 'sm:p-8' : ''}`}>
            <span className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#F2C349] sm:text-[10px]">{story.eyebrow}</span>
            <h3 className={`max-w-[34rem] font-black leading-[1.02] ${story.layout === 'wide' ? 'text-3xl sm:text-4xl lg:text-5xl' : story.layout === 'tall' ? 'text-2xl sm:text-3xl' : 'text-2xl sm:text-[1.75rem]'}`}>{story.title}</h3>
            {story.layout !== 'square' || index % 2 === 0 ? <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{story.body}</p> : null}
            <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white">
              Explore this story <ArrowUpRight aria-hidden="true" size={15} />
            </span>
          </div>
        )}
      </Link>
      {isImageOnly && <span className="sr-only">{story.eyebrow}</span>}
    </motion.article>
  );
}

export default function HomepageMagazine({
  eyebrow,
  title,
  intro,
  stories,
  accentColor,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  stories: HomepageMagazineStory[];
  accentColor: string;
}) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-24">
      <header className="mb-9 grid gap-6 border-b border-[#D9DED7] pb-8 sm:mb-12 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] lg:items-end">
        <div>
          <p style={{ color: accentColor }} className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.24em] sm:text-xs">{eyebrow}</p>
          <h2 id="magazine-highlights-title" className="max-w-4xl text-4xl font-black leading-[0.98] text-[#111827] sm:text-5xl lg:text-6xl">{title}</h2>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-[#59645D] sm:text-base lg:justify-self-end">{intro}</p>
      </header>
      <div className="space-y-1">
        {(() => {
          const sections: ({ type: 'feature'; story: HomepageMagazineStory; index: number } | { type: 'masonry'; stories: { story: HomepageMagazineStory; index: number }[] })[] = [];
          let masonry: { story: HomepageMagazineStory; index: number }[] = [];
          const flushMasonry = () => {
            if (masonry.length) sections.push({ type: 'masonry', stories: masonry });
            masonry = [];
          };
          stories.forEach((story, index) => {
            if (story.layout === 'wide' || story.layout === 'text-large') {
              flushMasonry();
              sections.push({ type: 'feature', story, index });
            } else {
              masonry.push({ story, index });
            }
          });
          flushMasonry();

          return sections.map((section, sectionIndex) => section.type === 'feature'
            ? <MagazineTile key={section.story.slug} story={section.story} index={section.index} />
            : <div key={`masonry-${sectionIndex}`} className="columns-1 gap-x-5 md:columns-3">{section.stories.map(({ story, index }) => <MagazineTile key={story.slug} story={story} index={index} />)}</div>);
        })()}
      </div>
    </div>
  );
}
