export interface LivestockCatalogEntry {
  id: string;
  name: string;
  breed: string;
  category: string;
  age: string;
  exhibitor: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

export const DEFAULT_LIVESTOCK_ENTRIES: LivestockCatalogEntry[] = [
  {
    id: 'f1', name: 'Rajputana Gold', breed: 'Bikaneri Dromedary', category: 'camels', age: '5 Years', exhibitor: 'Golden Camel Estate',
    description: 'Championship breeding dromedary known for high endurance, distinctive golden coat, and grand ceremonial posture.', image_url: '/assets/livestock_camel.jpg', is_featured: true,
  },
  {
    id: 'f2', name: 'Cheetak Lineage', breed: 'Marwari Stallion', category: 'horses', age: '4 Years', exhibitor: 'Kano Durbar Cavalry',
    description: 'Famous inward-turning ears, athletic build, and heritage lineage trained for ceremonial Durbar parades.', image_url: '/assets/durbar_horse_rider.jpg', is_featured: true,
  },
  {
    id: 'f3', name: 'Nandi Crest', breed: 'White Fulani Zebu', category: 'cattle', age: '6 Years', exhibitor: 'National Livestock Ranch',
    description: 'Prize-winning indigenous Zebu bull with iconic lyre-shaped horns, robust heat tolerance, and premium genetics.', image_url: '/assets/livestock_bull_cow.jpg', is_featured: true,
  },
  {
    id: 'f4', name: 'Sultan of Pushkar', breed: 'Jaisalmeri Camel', category: 'camels', age: '7 Years', exhibitor: 'Desert Crown Stud',
    description: 'Celebrated desert racing and parade camel featuring exceptional speed, tall stature, and royal saddle dress.', image_url: '/assets/fashion-parade/dromedary-camels-carnival-ground.jpg', is_featured: false,
  },
  {
    id: 'f5', name: 'Sokoto Gudali Prime', breed: 'Sokoto Gudali Bull', category: 'cattle', age: '5 Years', exhibitor: 'Northwest Cattle Alliance',
    description: 'Deep-bodied beef bull with smooth white coat, well-developed dewlap, and high live-weight yield certification.', image_url: '/assets/fashion-parade/handler-beside-sokoto-gudali.jpg', is_featured: false,
  },
  {
    id: 'f6', name: 'Balami Red Ram', breed: 'Balami Red Sheep', category: 'small-ruminants', age: '3 Years', exhibitor: 'Sahel Livestock Co-op',
    description: 'Large-framed desert sheep with long pendulous ears, prized for breeding quality and heavy mutton output.', image_url: '/assets/fashion-parade/balami-ram-and-goat-shed.jpg', is_featured: false,
  },
  {
    id: 'f7', name: 'West African Dwarf Goat', breed: 'WAD Buck', category: 'small-ruminants', age: '2 Years', exhibitor: 'Humane Herd Breeders',
    description: 'Hardy indigenous dwarf goat breed renowned for trypanotolerance and exceptional prolificacy.', image_url: '/assets/fashion-parade/goat-handler-traditional-attire.jpg', is_featured: false,
  },
];
