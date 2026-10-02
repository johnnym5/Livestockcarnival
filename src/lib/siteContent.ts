import { DEFAULT_FASHION_BREEDS } from '@/data/fashionBreeds';
import { CARNIVAL_PROGRAM } from '@/data/carnivalProgram';
import { DEFAULT_LIVESTOCK_ENTRIES } from '@/data/livestockCatalog';
import { DEFAULT_EVENT_VENUES, DEFAULT_VENUES } from '@/data/venueCatalog';
import { DEFAULT_HOMEPAGE_MAGAZINE_STORIES } from '@/lib/homepageMagazine';

export const DEFAULT_SITE_CONTENT: Record<string, Record<string, unknown>> = {
  magazine: {
    eyebrow: 'THE NATIONAL LIVESTOCK CARNIVAL',
    title: 'Livestock, Culture & Opportunity',
    intro: 'Champion breeds, Nigerian pageantry, live music and food, bringing families, herders and agribusiness together in Abuja.',
    backgroundColor: '#FBFBFA',
    accentColor: '#8D6B1B',
    stories: DEFAULT_HOMEPAGE_MAGAZINE_STORIES,
  },
  schedule: {
    eyebrow: 'Carnival Program',
    title: '3-Day Official Carnival Program',
    intro: '21 – 23 November 2026 • Old Parade Ground, Area 10, Garki, Abuja. Explore the ceremonies, breed judging, business forums, and live performances planned across all three days.',
    days: CARNIVAL_PROGRAM,
    venues: DEFAULT_VENUES,
    eventVenues: DEFAULT_EVENT_VENUES,
  },
  livestock: {
    badge: 'Golden Camel & Livestock Registry',
    title: 'Championship Herds & Royal Cavalry',
    description: 'Explore official verified records of premier dromedaries, royal Durbar steeds, and certified Zebu cattle from leading livestock breeders and Emirates across Nigeria.',
    entries: DEFAULT_LIVESTOCK_ENTRIES,
    catalogInitialized: true,
  },
  fashion: {
    pageCopy: {
      title: 'National Livestock Carnival: Livestock Cultural Fashion Parade',
      tagline: 'Where Agriculture Meets Fashion',
      description: "Celebrating Nigeria's breeds and cultural heritage as a symbol of national renewal. Our Livestock. Our Culture. Our Heritage.",
    },
    breeds: DEFAULT_FASHION_BREEDS,
  },
};

export type SiteContentKey = keyof typeof DEFAULT_SITE_CONTENT;
