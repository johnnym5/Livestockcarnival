export interface CardData {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  link: string;
  cta: string;
  pageTitle: string;
  coverBg: string;
  accentColor: string;
}

export const DEFAULT_HOMEPAGE_CARDS: CardData[] = [
  { id: 'card-1', number: '01', eyebrow: 'EXHIBITION · CHAMPIONSHIP LIVESTOCK', title: 'Elite Breeds & Championship Pavilion', body: 'Explore Nigeria’s premier White Fulani bulls, Sokoto Gudali, Azawak Camels, Red Sokoto Goats, Balami Sheep, and high-yield indigenous poultry.', image: '/assets/livestock/showcase-spectrum-hero.jpg', link: '/livestock', cta: 'EXPLORE ALL LIVESTOCK BREEDS', pageTitle: 'LIVESTOCK & CHAMPIONSHIP BREEDS', coverBg: 'from-[#062412] via-[#0D4020] to-[#031209]', accentColor: '#E4B03A' },
  { id: 'card-2', number: '02', eyebrow: 'RUNWAY · CULTURAL ARTS & PAGEANTRY', title: 'Livestock Cultural Fashion & Pageant', body: "Nigeria's first livestock fashion runway where prize cattle and camels are draped in hand-woven Aso-Oke, featuring cultural dancers and the Queen/King NLC Pageant.", image: '/assets/attractions/cultural-fashion-runway.jpg', link: '/fashion-parade', cta: 'EXPLORE CULTURAL FASHION SHOWCASE', pageTitle: 'CULTURAL FASHION & PAGEANTRY', coverBg: 'from-[#2A2006] via-[#4A380A] to-[#141003]', accentColor: '#FBBF24' },
  { id: 'card-3', number: '03', eyebrow: 'NAVIGATION · ABUJA NATIONAL GROUNDS', title: 'Interactive 3D Venue Map & Zone Guide', body: 'Navigate Old Parade Ground, Abuja: Equestrian Durbar Fields, Suya Village, Live Auction Arenas, Exhibition Pavilions, VIP Lounges, and Parking Hubs.', image: '/assets/venue-map/old-parade-ground-map-clean.jpg', link: '/schedule#map', cta: 'OPEN INTERACTIVE VENUE MAP', pageTitle: 'INTERACTIVE VENUE MAP', coverBg: 'from-[#120A3A] via-[#20125C] to-[#0B0624]', accentColor: '#A78BFA' },
  { id: 'card-4', number: '04', eyebrow: 'ENTERTAINMENT · LIVE STAGE & ARTS', title: 'Grand Concerts & 36-State Cultural Festival', body: 'Nightly headline music concerts, traditional masquerades, 36-state cultural dance troupes, kids petting zoo, and family entertainment arenas.', image: '/assets/home/story-live-concert-stage.jpg', link: '/attractions', cta: 'VIEW CARNIVAL ATTRACTIONS', pageTitle: 'CARNIVAL ATTRACTIONS & STAGES', coverBg: 'from-[#0E2014] via-[#1A3824] to-[#08120B]', accentColor: '#34D399' },
  { id: 'card-5', number: '05', eyebrow: 'DAY 1 · ROYAL CAVALRY & EQUESTRIAN', title: 'Royal Horse Cavalry & Durbar Parade', body: 'Witness over 200 ceremonial war stallions, traditional Northern horsemen, camel pageantry and royal racing displays in a breathtaking celebration of national heritage.', image: '/assets/home/story-equestrian-durbar-parade.jpg', link: '/schedule', cta: 'VIEW DURBAR SCHEDULE', pageTitle: 'ROYAL DURBAR & PROGRAM SCHEDULE', coverBg: 'from-[#062412] via-[#0D4020] to-[#031209]', accentColor: '#E4B03A' },
  { id: 'card-6', number: '06', eyebrow: 'GASTRONOMY · SUYA VILLAGE & FOOD FEST', title: 'Open-Flame Suya Village & Artisanal Feast', body: "Nigeria's largest outdoor open-flame grilling arena featuring master Suya chefs, artisanal Kilishi, gourmet catfish BBQ, organic spice markets, and family festival dining.", image: '/assets/home/story-suya-grill-fire.jpg', link: '/attractions#suya-village', cta: 'DISCOVER CULINARY VILLAGE', pageTitle: 'OPEN-FLAME SUYA VILLAGE', coverBg: 'from-[#3A0A0A] via-[#5C1212] to-[#240606]', accentColor: '#F87171' },
  { id: 'card-7', number: '07', eyebrow: 'TECHNOLOGY · NHESICS REGISTRY', title: 'National Herd Health, Security & Traceability', body: 'Discover the FGN digital herd management framework: RFID microchip tagging, real-time epidemic monitoring, biometric cattle passports, and ranch security.', image: '/assets/home/story-digital-rfid-livestock-tag.jpg', link: '/nhesics', cta: 'EXPLORE NHESICS SYSTEM', pageTitle: 'DIGITAL RFID HERD REGISTRY', coverBg: 'from-[#062A28] via-[#0D4845] to-[#031817]', accentColor: '#2DD4BF' },
  { id: 'card-8', number: '08', eyebrow: 'BROADCAST · MEDIA & GALLERY', title: 'Media Gallery, Live Broadcasts & Newsroom', body: 'Access official press releases, high-definition photo galleries, video highlights, live stream feeds, and media accreditation resources.', image: '/assets/home/story-live-concert-stage.jpg', link: '/media', cta: 'VISIT MEDIA & GALLERY PAGE', pageTitle: 'MEDIA & LIVE BROADCASTS', coverBg: 'from-[#0E2014] via-[#1A3824] to-[#08120B]', accentColor: '#34D399' },
  { id: 'card-9', number: '09', eyebrow: 'ACCREDITATION · VIP & PRESS PASSES', title: 'Official Accreditation & Pass Registration', body: 'Register for fast-track VIP entrance badges, international delegation clearance, press credentials, and official carnival passes.', image: '/assets/home/story-carnival-entrance-gate.jpg', link: '/accreditation', cta: 'APPLY FOR ACCREDITATION', pageTitle: 'OFFICIAL ACCREDITATION', coverBg: 'from-[#240A28] via-[#3E1245] to-[#150618]', accentColor: '#E879F9' },
  { id: 'card-10', number: '10', eyebrow: 'INITIATIVE · RENEWED HOPE VISION', title: 'About the Carnival & Agricultural Heritage', body: "Learn about the Federal Ministry of Livestock Development's master plan to modernize agribusiness, transform pastoral livelihoods, and drive national growth.", image: '/assets/home/story-modern-ranch-pasture.jpg', link: '/about', cta: 'READ INITIATIVE VISION', pageTitle: 'ABOUT THE CARNIVAL VISION', coverBg: 'from-[#211904] via-[#3D2E08] to-[#120E02]', accentColor: '#FACC15' },
];

export function mapCmsCard(row: Record<string, unknown>): CardData {
  return {
    id: String(row.id), number: String(row.number ?? ''), eyebrow: String(row.eyebrow ?? ''),
    title: String(row.title ?? ''), body: String(row.body ?? ''), image: String(row.image ?? ''),
    link: String(row.link ?? '/'), cta: String(row.cta ?? 'EXPLORE'), pageTitle: String(row.page_title ?? ''),
    coverBg: String(row.cover_bg ?? 'from-[#062412] via-[#0D4020] to-[#031209]'), accentColor: String(row.accent_color ?? '#E4B03A'),
  };
}
