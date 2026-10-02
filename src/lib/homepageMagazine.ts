export type MagazineTileLayout = 'wide' | 'square' | 'tall' | 'text' | 'text-large' | 'text-small' | 'image';

export interface HomepageMagazineStory {
  slug: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  layout: MagazineTileLayout;
}

export const HOMEPAGE_MAGAZINE_DESTINATIONS: Record<string, string> = {
  'schedule-map': '/schedule#map',
  livestock: '/livestock',
  attractions: '/attractions',
  fashion: '/fashion-parade',
  nhesics: '/nhesics',
  media: '/media',
  accreditation: '/accreditation',
  about: '/about',
  contact: '/contact',
};

export const DEFAULT_HOMEPAGE_MAGAZINE_STORIES: HomepageMagazineStory[] = [
  {
    slug: 'schedule-map',
    eyebrow: 'PLAN YOUR VISIT · 21–23 NOVEMBER 2026',
    title: 'Three days, one festival ground',
    body: 'Browse the official program, choose an event, and see where it happens on the Abuja venue map.',
    image: '/assets/venue-map/old-parade-ground-map-annotated.jpg',
    layout: 'wide',
  },
  {
    slug: 'livestock',
    eyebrow: 'THE BREED PAVILION',
    title: 'Champions of the herd',
    body: 'Meet celebrated cattle, camels, sheep, goats, and indigenous poultry from across Nigeria.',
    image: '/assets/livestock/showcase-spectrum-hero.jpg',
    layout: 'square',
  },
  {
    slug: 'attractions',
    eyebrow: 'AROUND THE GROUNDS',
    title: 'A festival of arenas',
    body: 'From the Durbar oval to live demonstrations and family attractions, discover what is happening across the grounds.',
    image: '/assets/attractions/arena-equestrian-durbar-field.jpg',
    layout: 'tall',
  },
  {
    slug: 'fashion',
    eyebrow: 'CULTURE IN MOTION',
    title: 'Where livestock meets the runway',
    body: 'Traditional textiles, celebrated breeds, and Nigerian pageantry meet in a distinctive cultural showcase.',
    image: '/assets/fashion-parade/handler-walking-white-bull-runway.jpg',
    layout: 'image',
  },
  {
    slug: 'nhesics',
    eyebrow: 'A NATIONAL LIVESTOCK VISION',
    title: 'Building a connected herd economy',
    body: 'Explore the strategy bringing together investment, digital traceability, halal value chains, and new opportunities for livestock communities.',
    image: '/assets/home/story-digital-rfid-livestock-tag.jpg',
    layout: 'text-large',
  },
  {
    slug: 'media',
    eyebrow: 'FROM THE NEWSROOM',
    title: 'The stories, sounds, and scenes',
    body: 'Find festival announcements, press resources, photo galleries, and live coverage in the official media center.',
    image: '/assets/home/story-live-concert-stage.jpg',
    layout: 'wide',
  },
  {
    slug: 'accreditation',
    eyebrow: 'PRESS & BROADCAST OPERATIONS',
    title: 'Your place behind the lens',
    body: 'Media professionals can review accreditation requirements and apply for official carnival access.',
    image: '/assets/home/story-carnival-entrance-gate.jpg',
    layout: 'square',
  },
  {
    slug: 'about',
    eyebrow: 'THE BIGGER PICTURE',
    title: 'Heritage with a future',
    body: 'Learn how the carnival brings livestock development, cultural heritage, and agribusiness opportunity together.',
    image: '/assets/home/story-modern-ranch-pasture.jpg',
    layout: 'text-small',
  },
  {
    slug: 'contact',
    eyebrow: 'YOUR VISIT STARTS HERE',
    title: 'Find the grounds and reach the team',
    body: 'Get directions to Old Parade Ground in Abuja and find the right team for visitor, media, and exhibitor enquiries.',
    image: '/assets/venue-map/old-parade-ground-map-clean.jpg',
    layout: 'image',
  },
];

const MAGAZINE_LAYOUTS = new Set<MagazineTileLayout>(['wide', 'square', 'tall', 'text', 'text-large', 'text-small', 'image']);

export function resolveHomepageMagazineStories(value: unknown): HomepageMagazineStory[] {
  const savedStories = value && typeof value === 'object' && !Array.isArray(value)
    ? (value as { stories?: unknown }).stories
    : undefined;
  if (!Array.isArray(savedStories)) return DEFAULT_HOMEPAGE_MAGAZINE_STORIES;

  const savedBySlug = new Map(
    savedStories.filter((story): story is Record<string, unknown> => Boolean(story) && typeof story === 'object' && !Array.isArray(story))
      .map((story) => [String(story.slug ?? ''), story]),
  );

  const defaultBySlug = new Map(DEFAULT_HOMEPAGE_MAGAZINE_STORIES.map((story) => [story.slug, story]));
  const orderedSlugs = Array.isArray(savedStories)
    ? [...new Set(savedStories.flatMap((story) => story && typeof story === 'object' && !Array.isArray(story) && typeof (story as Record<string, unknown>).slug === 'string' ? [(story as Record<string, unknown>).slug as string] : []))]
      .filter((slug) => defaultBySlug.has(slug))
    : [];
  for (const story of DEFAULT_HOMEPAGE_MAGAZINE_STORIES) {
    if (!orderedSlugs.includes(story.slug)) orderedSlugs.push(story.slug);
  }

  return orderedSlugs.map((slug) => {
    const defaultStory = defaultBySlug.get(slug)!;
    const saved = savedBySlug.get(defaultStory.slug);
    if (!saved) return defaultStory;
    const layout = String(saved.layout ?? defaultStory.layout) as MagazineTileLayout;
    return {
      ...defaultStory,
      eyebrow: typeof saved.eyebrow === 'string' ? saved.eyebrow : defaultStory.eyebrow,
      title: typeof saved.title === 'string' && saved.title.trim() ? saved.title : defaultStory.title,
      body: typeof saved.body === 'string' ? saved.body : defaultStory.body,
      image: typeof saved.image === 'string' ? saved.image : defaultStory.image,
      layout: MAGAZINE_LAYOUTS.has(layout) ? layout : defaultStory.layout,
    };
  });
}
