export type FashionBreed = {
  id: string;
  name: string;
  category: string;
  origin: 'Local/Nigerian' | 'West African' | 'Exotic';
  purpose: 'Dairy' | 'Meat' | 'Traction' | 'Exhibition';
  traits: string;
  economic: string;
  image: string;
};

export const DEFAULT_FASHION_BREEDS: FashionBreed[] = [
  { id: 'bunaji', name: 'White Fulani (Bunaji)', category: 'Cattle & Equines', origin: 'Local/Nigerian', purpose: 'Dairy', traits: 'Lyre-shaped horns, pure white coat providing high solar reflectance, heat tolerance, and endemic disease resistance.', economic: "Represents approximately 37% of Nigeria's national cattle herd. Major domestic producer of fresh milk, beef, and artisanal leather.", image: '/assets/fashion-parade/handler-walking-white-bull-runway.jpg' },
  { id: 'gudali', name: 'Sokoto Gudali', category: 'Cattle & Equines', origin: 'Local/Nigerian', purpose: 'Meat', traits: 'Deep, fleshy conformation, short horns or polled, calm disposition, and rapid weight conversion on savanna pastures.', economic: 'Premier commercial beef breed anchoring Northern livestock trading rings and organized live-weight auctions.', image: '/assets/fashion-parade/handler-beside-sokoto-gudali.jpg' },
  { id: 'dromedary', name: 'Sahelian Dromedary', category: 'Camels', origin: 'Local/Nigerian', purpose: 'Traction', traits: 'Single-hump desert conformation, broad padded footpads for desert mobility, exceptional water conservation physiology.', economic: 'Crucial for Northern cross-border caravans, cultural Durbar pageantry, and nutrient-dense camel dairy production.', image: '/assets/fashion-parade/handler-leading-saddled-camel.jpg' },
  { id: 'wad-goat', name: 'West African Dwarf Goat', category: 'Small Ruminants', origin: 'Local/Nigerian', purpose: 'Meat', traits: 'Compact hardy stature (30–50cm), high prolificacy with frequent twin births, and natural trypanotolerance against tsetse flies.', economic: 'The foundational livestock asset of southern Nigeria, driving rural household food security and ceremonial wealth.', image: '/assets/fashion-parade/goat-handler-traditional-attire.jpg' },
  { id: 'balami-sheep', name: 'Balami Giant Ram', category: 'Small Ruminants', origin: 'West African', purpose: 'Exhibition', traits: 'Convex Roman nose, pure white fleece, tall frame exceeding 100kg live weight, and magnificent spiraled horn conformation.', economic: 'The sovereign champion of national festival markets, highly sought-after for ceremonial displays and stud enhancement.', image: '/assets/fashion-parade/balami-ram-and-goat-shed.jpg' },
  { id: 'moorbeta-chicken', name: 'MoorBeta Indigenous Chicken', category: 'Poultry', origin: 'Local/Nigerian', purpose: 'Meat', traits: 'Hardy dual-purpose scavenger ecotype, lustrous plumage, alert temperament, and strong natural disease resistance.', economic: 'Essential for backyard village poultry systems, delivering organic poultry meat and farm-fresh heirloom eggs.', image: '/assets/fashion-parade/guinea-fowl-chickens-aviary.jpg' },
  { id: 'giant-snail', name: 'Giant African Snail (Archachatina)', category: 'Micro-Livestock & Farm Displays', origin: 'Local/Nigerian', purpose: 'Meat', traits: 'Massive helical shell, high protein conversion efficiency, odorless husbandry, thriving in shaded humid micro-biomes.', economic: 'Rapidly expanding high-margin enterprise supplying fine-dining hospitality and pharmaceutical-grade mucin extracts.', image: '/assets/fashion-parade/catfish-and-snails-display.jpg' },
  { id: 'ostrich', name: 'Sahelian Red-Neck Ostrich', category: 'Exotic Displays', origin: 'Exotic', purpose: 'Exhibition', traits: 'Largest living flightless avian, swift terrestrial speeds up to 70 km/h, and dense climate-resistant feather coverage.', economic: 'High-value conservation genetics, ecological education, and sustainable eco-tourism exhibition draw.', image: '/assets/fashion-parade/ostrich-standing-grassland.jpg' },
];
