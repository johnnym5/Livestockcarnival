'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Calendar,
  MapPin,
  Ticket,
  CheckCircle,
  ArrowRight,
  Sprout,
  Users,
  Feather,
  Briefcase,
  Layers,
  Sun,
  ShieldCheck,
  Tag,
  Heart,
  Compass,
  Waves,
  Map,
  User,
  Check,
  Palette,
  Megaphone,
  Radio,
  Music,
  GraduationCap,
  Camera,
  Home,
  SunMedium,
  Droplet,
  Activity,
  Recycle,
  CheckCircle2,
  QrCode,
  ChevronRight,
  ExternalLink,
  Shield,
  TrendingUp,
  Handshake,
  ArrowLeftRight,
} from 'lucide-react';

// ── Subtle 500ms editorial transition ──
const editorialTransition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1] as const,
};

// ── Breed Directory Dataset ──
interface BreedItem {
  id: string;
  name: string;
  category: string;
  origin: 'Local/Nigerian' | 'West African' | 'Exotic';
  purpose: 'Dairy' | 'Meat' | 'Traction' | 'Exhibition';
  traits: string;
  economic: string;
  image: string;
}

const breedDirectory: BreedItem[] = [
  {
    id: 'bunaji',
    name: 'White Fulani (Bunaji)',
    category: 'Cattle & Equines',
    origin: 'Local/Nigerian',
    purpose: 'Dairy',
    traits:
      'Lyre-shaped horns, pure white coat providing high solar reflectance, heat tolerance, and endemic disease resistance.',
    economic:
      'Represents approximately 37% of Nigeria\'s national cattle herd. Major domestic producer of fresh milk, beef, and artisanal leather.',
    image: '/assets/fashion-parade/handler-walking-white-bull-runway.jpg',
  },
  {
    id: 'gudali',
    name: 'Sokoto Gudali',
    category: 'Cattle & Equines',
    origin: 'Local/Nigerian',
    purpose: 'Meat',
    traits:
      'Deep, fleshy conformation, short horns or polled, calm disposition, and rapid weight conversion on savanna pastures.',
    economic:
      'Premier commercial beef breed anchoring Northern livestock trading rings and organized live-weight auctions.',
    image: '/assets/fashion-parade/handler-beside-sokoto-gudali.jpg',
  },
  {
    id: 'dromedary',
    name: 'Sahelian Dromedary',
    category: 'Camels',
    origin: 'Local/Nigerian',
    purpose: 'Traction',
    traits:
      'Single-hump desert conformation, broad padded footpads for desert mobility, exceptional water conservation physiology.',
    economic:
      'Crucial for Northern cross-border caravans, cultural Durbar pageantry, and nutrient-dense camel dairy production.',
    image: '/assets/fashion-parade/handler-leading-saddled-camel.jpg',
  },
  {
    id: 'wad-goat',
    name: 'West African Dwarf Goat',
    category: 'Small Ruminants',
    origin: 'Local/Nigerian',
    purpose: 'Meat',
    traits:
      'Compact hardy stature (30–50cm), high prolificacy with frequent twin births, and natural trypanotolerance against tsetse flies.',
    economic:
      'The foundational livestock asset of southern Nigeria, driving rural household food security and ceremonial wealth.',
    image: '/assets/fashion-parade/goat-handler-traditional-attire.jpg',
  },
  {
    id: 'balami-sheep',
    name: 'Balami Giant Ram',
    category: 'Small Ruminants',
    origin: 'West African',
    purpose: 'Exhibition',
    traits:
      'Convex Roman nose, pure white fleece, tall frame exceeding 100kg live weight, and magnificent spiraled horn conformation.',
    economic:
      'The sovereign champion of national festival markets, highly sought-after for ceremonial displays and stud enhancement.',
    image: '/assets/fashion-parade/balami-ram-and-goat-shed.jpg',
  },
  {
    id: 'moorbeta-chicken',
    name: 'MoorBeta Indigenous Chicken',
    category: 'Poultry',
    origin: 'Local/Nigerian',
    purpose: 'Meat',
    traits:
      'Hardy dual-purpose scavenger ecotype, lustrous plumage, alert temperament, and strong natural disease resistance.',
    economic:
      'Essential for backyard village poultry systems, delivering organic poultry meat and farm-fresh heirloom eggs.',
    image: '/assets/fashion-parade/guinea-fowl-chickens-aviary.jpg',
  },
  {
    id: 'giant-snail',
    name: 'Giant African Snail (Archachatina)',
    category: 'Micro-Livestock & Farm Displays',
    origin: 'Local/Nigerian',
    purpose: 'Meat',
    traits:
      'Massive helical shell, high protein conversion efficiency, odorless husbandry, thriving in shaded humid micro-biomes.',
    economic:
      'Rapidly expanding high-margin enterprise supplying fine-dining hospitality and pharmaceutical-grade mucin extracts.',
    image: '/assets/fashion-parade/catfish-and-snails-display.jpg',
  },
  {
    id: 'ostrich',
    name: 'Sahelian Red-Neck Ostrich',
    category: 'Exotic Displays',
    origin: 'Exotic',
    purpose: 'Exhibition',
    traits:
      'Largest living flightless avian, swift terrestrial speeds up to 70 km/h, and dense climate-resistant feather coverage.',
    economic:
      'High-value conservation genetics, ecological education, and sustainable eco-tourism exhibition draw.',
    image: '/assets/fashion-parade/ostrich-standing-grassland.jpg',
  },
];

export default function FashionParadePage() {
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [selectedBreed, setSelectedBreed] = useState<BreedItem>(breedDirectory[0]);

  const filteredBreeds = breedDirectory.filter((b) => {
    const matchesOrigin = originFilter === 'all' || b.origin === originFilter;
    const matchesPurpose = purposeFilter === 'all' || b.purpose === purposeFilter;
    return matchesOrigin && matchesPurpose;
  });

  return (
    <div className="w-full bg-[#FBFBFA] text-[#1F2937] selection:bg-[#E4B03A]/30 selection:text-[#0F4A2F]">
      {/* ─────────────────────────────────────────────────────────────
          A. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#FBFBFA] border-b border-[#0F4A2F]/10 pt-28 pb-16 sm:pt-36 sm:pb-24">
        {/* Subtle Ambient Radial Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E4B03A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D8EADF]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left">
              {/* Sovereign Endorsement Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={editorialTransition}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D8EADF] border border-[#0F4A2F]/20 text-[#0F4A2F] text-xs font-bold tracking-widest uppercase mb-6 shadow-xs"
              >
                <Award className="w-4 h-4 text-[#0F4A2F]" />
                <span>Office of the Vice President · Golden Camel &amp; Cow</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...editorialTransition, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F4A2F] tracking-tight leading-[1.1] mb-6 font-serif"
              >
                National Livestock Carnival: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4A2F] via-[#1B6543] to-[#0F4A2F]">
                  Livestock Cultural Fashion Parade
                </span>
              </motion.h1>

              {/* Subtitle & Motto */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...editorialTransition, delay: 0.2 }}
                className="text-lg sm:text-2xl font-bold text-[#1F2937] leading-snug mb-3 uppercase tracking-wide"
              >
                &ldquo;Where Agriculture Meets Fashion&rdquo;
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...editorialTransition, delay: 0.25 }}
                className="text-sm sm:text-base md:text-lg text-[#4B5563] max-w-lg leading-relaxed mb-10"
              >
                Celebrating Nigeria&apos;s breeds and cultural heritage as a symbol of national renewal.
                Our Livestock. Our Culture. Our Heritage.
              </motion.p>

              {/* Meta Badges Strip */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...editorialTransition, delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mb-10"
              >
                <div className="p-3.5 rounded-2xl bg-white border border-[#0F4A2F]/15 shadow-card flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3D6] flex items-center justify-center text-[#0F4A2F] shrink-0 border border-[#E4B03A]/30">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Festival Dates</p>
                    <p className="text-xs sm:text-sm font-black text-[#0F4A2F]">21 – 23 Nov 2026</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#0F4A2F]/15 shadow-card flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D8EADF] flex items-center justify-center text-[#0F4A2F] shrink-0 border border-[#0F4A2F]/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Venue Ground</p>
                    <p className="text-xs sm:text-sm font-black text-[#0F4A2F]">Abuja National Grounds</p>
                  </div>
                </div>
              </motion.div>

              {/* Primary Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...editorialTransition, delay: 0.35 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a
                  href="#lineup"
                  className="px-7 py-3.5 rounded-xl bg-[#0F4A2F] hover:bg-[#1B6543] text-white text-xs font-black uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>Explore Exhibits</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#pass"
                  className="px-7 py-3.5 rounded-xl bg-[#E4B03A] hover:bg-[#F5D076] text-[#1F2937] text-xs font-black uppercase tracking-wider shadow-button hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>Get Entry Pass</span>
                  <CheckCircle className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...editorialTransition, delay: 0.15 }}
              className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <Image 
                src="/assets/fashion-parade/handler-walking-white-bull-runway.jpg" 
                alt="White Bunaji bull being walked on a wooden runway by handler in green/gold Agbada, large crowd watching at sunset" 
                fill 
                className="object-cover" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          B. THE 4 STRATEGIC PILLARS
      ───────────────────────────────────────────────────────────── */}
      <section id="pillars" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3D6] border border-[#E4B03A]/30 text-[#9E7519] text-xs font-bold uppercase tracking-widest mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>National Development Framework</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F4A2F] tracking-tight font-serif mb-3">
            The Four Strategic Pillars
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Aligning ancestral pastoral excellence with modern socioeconomic growth under the Renewed Hope Agenda.
          </p>
        </div>

        {/* 4 Cards using Pastel Sage Surfaces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Renewal */}
          <div className="rounded-2xl bg-[#D8EADF] border border-[#0F4A2F]/20 p-7 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0F4A2F] mb-5 shadow-xs border border-[#0F4A2F]/15">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0F4A2F]/70 block mb-1">Pillar 01</span>
              <h3 className="text-xl font-bold text-[#0F4A2F] mb-3 font-serif">Renewal</h3>
              <p className="text-sm text-[#1F2937]/90 leading-relaxed font-normal">
                Agriculture resilience and productivity renewal through upgraded genetics, sustainable pastures, and commercial value addition.
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-[#0F4A2F]/15 flex items-center gap-1.5 text-xs font-bold text-[#0F4A2F]">
              <TrendingUp className="w-4 h-4" />
              <span>Productivity &amp; Feed Security</span>
            </div>
          </div>

          {/* Pillar 2: Unity */}
          <div className="rounded-2xl bg-[#D8EADF] border border-[#0F4A2F]/20 p-7 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0F4A2F] mb-5 shadow-xs border border-[#0F4A2F]/15">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0F4A2F]/70 block mb-1">Pillar 02</span>
              <h3 className="text-xl font-bold text-[#0F4A2F] mb-3 font-serif">Unity</h3>
              <p className="text-sm text-[#1F2937]/90 leading-relaxed font-normal">
                Uniting regional livestock traditions, pastoral communities, and commercial ranchers on one cohesive national ceremonial stage.
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-[#0F4A2F]/15 flex items-center gap-1.5 text-xs font-bold text-[#0F4A2F]">
              <Handshake className="w-4 h-4" />
              <span>One National Platform</span>
            </div>
          </div>

          {/* Pillar 3: Culture */}
          <div className="rounded-2xl bg-[#D8EADF] border border-[#0F4A2F]/20 p-7 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0F4A2F] mb-5 shadow-xs border border-[#0F4A2F]/15">
                <Feather className="w-6 h-6 text-[#9E7519]" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0F4A2F]/70 block mb-1">Pillar 03</span>
              <h3 className="text-xl font-bold text-[#0F4A2F] mb-3 font-serif">Culture</h3>
              <p className="text-sm text-[#1F2937]/90 leading-relaxed font-normal">
                Celebrating regional fabrics, traditional textiles, beadwork, and ceremonial handler attire honoring Nigeria&apos;s living heritage.
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-[#0F4A2F]/15 flex items-center gap-1.5 text-xs font-bold text-[#0F4A2F]">
              <Palette className="w-4 h-4" />
              <span>Ancestral Textile Arts</span>
            </div>
          </div>

          {/* Pillar 4: Opportunity */}
          <div className="rounded-2xl bg-[#D8EADF] border border-[#0F4A2F]/20 p-7 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0F4A2F] mb-5 shadow-xs border border-[#0F4A2F]/15">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0F4A2F]/70 block mb-1">Pillar 04</span>
              <h3 className="text-xl font-bold text-[#0F4A2F] mb-3 font-serif">Opportunity</h3>
              <p className="text-sm text-[#1F2937]/90 leading-relaxed font-normal">
                Unlocking agro-education, youth apprenticeship, cultural tourism, and high-value enterprise partnerships across meat and leather value chains.
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-[#0F4A2F]/15 flex items-center gap-1.5 text-xs font-bold text-[#0F4A2F]">
              <TrendingUp className="w-4 h-4" />
              <span>Enterprise &amp; Tourism</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          C. THE LINE-UP: 7 EXHIBITION CATEGORIES
      ───────────────────────────────────────────────────────────── */}
      <section id="lineup" className="w-full py-20 bg-white border-y border-[#0F4A2F]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8EADF] text-[#0F4A2F] text-xs font-bold uppercase tracking-widest mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>The Exhibition Spectrum</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0F4A2F] tracking-tight font-serif">
                The Line-Up: 7 Exhibition Categories
              </h2>
              <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl mt-1">
                Browse the full spectrum of Nigeria&apos;s indigenous breeds and managed micro-livestock on display.
              </p>
            </div>

            <div className="text-xs font-bold text-[#6B7280] flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-[#0F4A2F]" />
              <span>Scroll horizontally on mobile devices</span>
            </div>
          </div>

          {/* 7 Category Track */}
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory px-4 sm:px-0">
            {/* 1. Camels */}
            <div className="w-[280px] sm:w-[320px] shrink-0 snap-center rounded-2xl bg-[#FBFBFA] border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col overflow-hidden group">
              <div className="h-48 w-full relative overflow-hidden">
                <Image src="/assets/fashion-parade/dromedary-camels-carnival-ground.jpg" alt="Dromedary camels" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7519] block mb-1">Class 01</span>
                  <h3 className="text-base font-bold text-[#0F4A2F] mb-2 font-serif flex items-center gap-2"><Sun className="w-4 h-4 text-[#9E7519]" /> Camels</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                    Dromedary &amp; desert caravans, renowned for endurance, milk yield, and royal desert pageantry.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0F4A2F]/10">
                  <span className="text-[11px] font-semibold text-[#0F4A2F] bg-[#D8EADF]/70 px-2 py-0.5 rounded-md inline-block">
                    Sahelian Ecotypes
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Cattle & Equines */}
            <div className="w-[280px] sm:w-[320px] shrink-0 snap-center rounded-2xl bg-[#FBFBFA] border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col overflow-hidden group">
              <div className="h-48 w-full relative overflow-hidden">
                <Image src="/assets/fashion-parade/exhibition-bull-and-horse-pens.jpg" alt="Cattle and Equines" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4A2F] block mb-1">Class 02</span>
                  <h3 className="text-base font-bold text-[#0F4A2F] mb-2 font-serif flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Cattle &amp; Equines</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                    Bunaji (White Fulani), Sokoto Gudali, Muturu, Arewa stallions, and sturdy Bornu donkeys.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0F4A2F]/10">
                  <span className="text-[11px] font-semibold text-[#0F4A2F] bg-[#D8EADF]/70 px-2 py-0.5 rounded-md inline-block">
                    Large Livestock
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Small Ruminants */}
            <div className="w-[280px] sm:w-[320px] shrink-0 snap-center rounded-2xl bg-[#FBFBFA] border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col overflow-hidden group">
              <div className="h-48 w-full relative overflow-hidden">
                <Image src="/assets/fashion-parade/balami-ram-and-goat-shed.jpg" alt="Small Ruminants" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7519] block mb-1">Class 03</span>
                  <h3 className="text-base font-bold text-[#0F4A2F] mb-2 font-serif flex items-center gap-2"><Tag className="w-4 h-4 text-[#9E7519]" /> Small Ruminants</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                    Goats (West African Dwarf, Maradi Red) and Sheep (Balami, Uda, Yankasa rams).
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0F4A2F]/10">
                  <span className="text-[11px] font-semibold text-[#0F4A2F] bg-[#D8EADF]/70 px-2 py-0.5 rounded-md inline-block">
                    Goats &amp; Sheep
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Small Animals */}
            <div className="w-[280px] sm:w-[320px] shrink-0 snap-center rounded-2xl bg-[#FBFBFA] border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col overflow-hidden group">
              <div className="h-48 w-full relative overflow-hidden">
                <Image src="/assets/fashion-parade/rabbits-in-ankara-hutch.jpg" alt="Small Animals" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4A2F] block mb-1">Class 04</span>
                  <h3 className="text-base font-bold text-[#0F4A2F] mb-2 font-serif flex items-center gap-2"><Heart className="w-4 h-4" /> Small Animals</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                    Commercial rabbits, ornamental peacocks, and domesticated guinea pigs.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0F4A2F]/10">
                  <span className="text-[11px] font-semibold text-[#0F4A2F] bg-[#D8EADF]/70 px-2 py-0.5 rounded-md inline-block">
                    Hutch &amp; Aviary
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Poultry */}
            <div className="w-[280px] sm:w-[320px] shrink-0 snap-center rounded-2xl bg-[#FBFBFA] border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col overflow-hidden group">
              <div className="h-48 w-full relative overflow-hidden">
                <Image src="/assets/fashion-parade/guinea-fowl-chickens-aviary.jpg" alt="Poultry" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7519] block mb-1">Class 05</span>
                  <h3 className="text-base font-bold text-[#0F4A2F] mb-2 font-serif flex items-center gap-2"><Feather className="w-4 h-4 text-[#9E7519]" /> Poultry</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                    Indigenous ecotypes, heritage turkeys, domestic geese, and helmeted guinea fowl.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0F4A2F]/10">
                  <span className="text-[11px] font-semibold text-[#0F4A2F] bg-[#D8EADF]/70 px-2 py-0.5 rounded-md inline-block">
                    Aviculture
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Exotic Displays */}
            <div className="w-[280px] sm:w-[320px] shrink-0 snap-center rounded-2xl bg-[#FBFBFA] border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col overflow-hidden group">
              <div className="h-48 w-full relative overflow-hidden">
                <Image src="/assets/fashion-parade/ostrich-standing-grassland.jpg" alt="Exotic Displays" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4A2F] block mb-1">Class 06</span>
                  <h3 className="text-base font-bold text-[#0F4A2F] mb-2 font-serif flex items-center gap-2"><Compass className="w-4 h-4" /> Exotic Displays</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                    Sahelian ostriches and vetted regional conservation displays with certified wild ecotypes.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0F4A2F]/10">
                  <span className="text-[11px] font-semibold text-[#0F4A2F] bg-[#D8EADF]/70 px-2 py-0.5 rounded-md inline-block">
                    Conservation
                  </span>
                </div>
              </div>
            </div>

            {/* 7. Micro-Livestock & Farm Displays */}
            <div className="w-[280px] sm:w-[320px] shrink-0 snap-center rounded-2xl bg-[#FBFBFA] border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col overflow-hidden group">
              <div className="h-48 w-full relative overflow-hidden">
                <Image src="/assets/fashion-parade/catfish-and-snails-display.jpg" alt="Micro-Livestock" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7519] block mb-1">Class 07</span>
                  <h3 className="text-base font-bold text-[#0F4A2F] mb-2 font-serif flex items-center gap-2"><Waves className="w-4 h-4 text-[#9E7519]" /> Micro-Livestock</h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                    Heliculture (Giant African snails) and aquaculture (African catfish &amp; tilapia displays).
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0F4A2F]/10">
                  <span className="text-[11px] font-semibold text-[#0F4A2F] bg-[#D8EADF]/70 px-2 py-0.5 rounded-md inline-block">
                    Snails &amp; Fish
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          D. CULTURAL REPRESENTATION BY REGION ("ONE NIGERIA")
      ───────────────────────────────────────────────────────────── */}
      <section id="regions" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8EADF] text-[#0F4A2F] text-xs font-bold uppercase tracking-widest mb-3">
            <Map className="w-3.5 h-3.5" />
            <span>National Diversity</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F4A2F] tracking-tight font-serif mb-2">
            Cultural Representation by Region
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Ancestral textile artistry and livestock styling across Nigeria&apos;s four primary corridors.
          </p>
        </div>

        {/* 4-Quadrant Regional Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Northern Corridor */}
          <div className="rounded-2xl bg-white border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row overflow-hidden">
            <div className="w-full sm:w-2/5 h-64 sm:h-auto relative">
              <Image src="/assets/fashion-parade/handler-leading-saddled-camel.jpg" alt="Northern Corridor camel" fill className="object-cover" />
            </div>
            <div className="w-full sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#0F4A2F] px-3 py-1 rounded-full bg-[#D8EADF]">
                    Northern Corridor
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B7280]">Sahel &amp; Savannas</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F4A2F] mb-2 font-serif">Kano &amp; Bornu Pastoral Splendor</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
                  Dromedary camels and royal Durbar steeds styled with Northern hand-woven textiles, indigo dye fabrics, leather-tooled ceremonial saddle pads, and brass tassels.
                </p>
                <div className="p-4 rounded-xl bg-[#FEF3D6]/60 border border-[#E4B03A]/20 mb-4">
                  <p className="text-xs font-bold text-[#0F4A2F] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#9E7519]" />
                    <span>Handler Attire</span>
                  </p>
                  <p className="text-xs text-[#1F2937] font-medium">
                    Flowing Babban Riga robes, layered traditional turbans, and handmade leather riding boots.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F4A2F]">
                <Check className="w-4 h-4 text-[#0F4A2F]" />
                <span>Key Breeds: Sahelian Camels, Arewa Stallions</span>
              </div>
            </div>
          </div>

          {/* Western Corridor */}
          <div className="rounded-2xl bg-white border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row overflow-hidden">
            <div className="w-full sm:w-2/5 h-64 sm:h-auto relative">
              <Image src="/assets/fashion-parade/handler-walking-white-bull-runway.jpg" alt="Western Corridor bull" fill className="object-cover" />
            </div>
            <div className="w-full sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#0F4A2F] px-3 py-1 rounded-full bg-[#D8EADF]">
                    Western Corridor
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B7280]">South-West Grasslands</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F4A2F] mb-2 font-serif">Aso-Oke Royal Adornment</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
                  Prized Bunaji cattle and horses draped in hand-loomed Aso-Oke back blankets (Alaari, Sanyan, Etu), accented with cowrie-shell beadwork and equestrian tassels.
                </p>
                <div className="p-4 rounded-xl bg-[#FEF3D6]/60 border border-[#E4B03A]/20 mb-4">
                  <p className="text-xs font-bold text-[#0F4A2F] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#9E7519]" />
                    <span>Handler Attire</span>
                  </p>
                  <p className="text-xs text-[#1F2937] font-medium">
                    Bespoke Aso-Oke Agbada with matching Fila cap and ceremonial horse-tail fly-whisk.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F4A2F]">
                <Check className="w-4 h-4 text-[#0F4A2F]" />
                <span>Key Breeds: Bunaji, Muturu Cattle</span>
              </div>
            </div>
          </div>

          {/* Eastern Corridor */}
          <div className="rounded-2xl bg-white border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row overflow-hidden">
            <div className="w-full sm:w-2/5 h-64 sm:h-auto relative">
              <Image src="/assets/fashion-parade/goat-handler-traditional-attire.jpg" alt="Eastern Corridor goat" fill className="object-cover" />
            </div>
            <div className="w-full sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#0F4A2F] px-3 py-1 rounded-full bg-[#D8EADF]">
                    Eastern Corridor
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B7280]">South-East Agro Belt</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F4A2F] mb-2 font-serif">Akwete Weaving &amp; Isiagu</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
                  Native goats and championship rams presented with geometric Akwete woven chest collars, symbolic Isiagu lion-crest banners, and braided natural raffia garlands.
                </p>
                <div className="p-4 rounded-xl bg-[#FEF3D6]/60 border border-[#E4B03A]/20 mb-4">
                  <p className="text-xs font-bold text-[#0F4A2F] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#9E7519]" />
                    <span>Handler Attire</span>
                  </p>
                  <p className="text-xs text-[#1F2937] font-medium">
                    Traditional Isiagu tunic, red Okpu Agu cap, and ceremonial hand-woven fan.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F4A2F]">
                <Check className="w-4 h-4 text-[#0F4A2F]" />
                <span>Key Breeds: WAD Goats, Dwarf Sheep</span>
              </div>
            </div>
          </div>

          {/* Southern / Niger Delta */}
          <div className="rounded-2xl bg-white border border-[#0F4A2F]/15 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row overflow-hidden">
            <div className="w-full sm:w-2/5 h-64 sm:h-auto relative">
              <Image src="/assets/fashion-parade/catfish-and-snails-display.jpg" alt="Southern Corridor snails" fill className="object-cover" />
            </div>
            <div className="w-full sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#0F4A2F] px-3 py-1 rounded-full bg-[#D8EADF]">
                    Southern / Niger Delta
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B7280]">Coastal Wetlands</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F4A2F] mb-2 font-serif">Riverine George Silks</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
                  Specialized riverine livestock and snail terrariums styled with vibrant George wrapper textiles, multi-strand coral bead ropes, and mangrove timber staging.
                </p>
                <div className="p-4 rounded-xl bg-[#FEF3D6]/60 border border-[#E4B03A]/20 mb-4">
                  <p className="text-xs font-bold text-[#0F4A2F] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#9E7519]" />
                    <span>Handler Attire</span>
                  </p>
                  <p className="text-xs text-[#1F2937] font-medium">
                    Traditional Etibo shirt, flowing George wrapper, coral necklace, and walking stick.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F4A2F]">
                <Check className="w-4 h-4 text-[#0F4A2F]" />
                <span>Key Breeds: Snails, Catfish</span>
              </div>
            </div>
          </div>
        </div>

        {/* Motto Banner */}
        <div className="w-full rounded-2xl bg-[#0F4A2F] text-white p-6 sm:p-8 text-center shadow-md border border-[#1B6543]">
          <p className="text-base sm:text-xl font-bold tracking-wide uppercase text-[#FEF3D6]">
            &ldquo;Different cultures. Different traditions. One Nigeria.&rdquo;
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          E. THE MAIN ATTRACTION: FASHION MEETS AGRICULTURE
      ───────────────────────────────────────────────────────────── */}
      <section id="fashion" className="w-full py-20 bg-[#FBFBFA] border-t border-[#0F4A2F]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3D6] text-[#9E7519] text-xs font-bold uppercase tracking-widest mb-3 border border-[#E4B03A]/30">
              <Palette className="w-3.5 h-3.5" />
              <span>The Red Carpet Oval</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F4A2F] tracking-tight font-serif mb-3">
              The Main Attraction: Fashion Meets Agriculture
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563]">
              A high-visibility national runway pairing livestock conformation with ethical, ancestral textile styling.
            </p>
          </div>

          {/* Split-Screen Visual Storytelling Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Livestock Dressing Concept */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-[#0F4A2F]/15 p-8 shadow-card space-y-6">
              <div className="w-full h-48 sm:h-64 relative rounded-xl overflow-hidden mb-2">
                <Image src="/assets/fashion-parade/handler-displaying-livestock-outdoors.jpg" alt="Handler displaying livestock outdoors" fill className="object-cover" />
              </div>
              <div className="flex items-center gap-3 pb-4 border-b border-[#0F4A2F]/10">
                <div className="w-10 h-10 rounded-xl bg-[#D8EADF] flex items-center justify-center text-[#0F4A2F] shrink-0">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F4A2F] font-serif">Livestock Dressing Concept</h3>
                  <p className="text-xs text-[#6B7280]">Ethical, non-restrictive cultural embellishment</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#0F4A2F]/10">
                  <h4 className="text-sm font-bold text-[#0F4A2F] mb-1">Camels &amp; Horses</h4>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Traditional quilted saddle cloths, braided mane ribbons, soft leather pommels, and handlers in matching regional robes.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#0F4A2F]/10">
                  <h4 className="text-sm font-bold text-[#0F4A2F] mb-1">Cattle (Bulls &amp; Heifers)</h4>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Aso-Oke back drapes, hand-braided organic cotton neck garlands, and polished horn cuffs with zero adhesive or chemical treatment.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#0F4A2F]/10">
                  <h4 className="text-sm font-bold text-[#0F4A2F] mb-1">Small Ruminants (Goats &amp; Sheep)</h4>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Loose textile neckbands, patterned cotton halters, and natural raffia side bands tailored for complete respiratory freedom.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#0F4A2F]/10">
                  <h4 className="text-sm font-bold text-[#0F4A2F] mb-1">Poultry &amp; Small Animals</h4>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Decorated Ankara hutches, bamboo aviary floats, and botanical shaded perches — strictly nothing tied or worn directly on birds or rabbits.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Parade Highlights & Spectator Experience */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-[#0F4A2F]/15 p-8 shadow-card space-y-6">
              <div className="w-full h-48 sm:h-64 relative rounded-xl overflow-hidden mb-2">
                <Image src="/assets/fashion-parade/attendees-walking-livestock-pens.jpg" alt="Attendees walking livestock pens" fill className="object-cover" />
              </div>
              <div className="flex items-center gap-3 pb-4 border-b border-[#0F4A2F]/10">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3D6] flex items-center justify-center text-[#0F4A2F] shrink-0 border border-[#E4B03A]/30">
                  <Megaphone className="w-5 h-5 text-[#9E7519]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F4A2F] font-serif">Parade Highlights</h3>
                  <p className="text-xs text-[#6B7280]">What visitors experience on the ceremonial runway</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#D8EADF]/30 border border-[#0F4A2F]/10">
                  <Radio className="w-5 h-5 text-[#0F4A2F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0F4A2F]">Live Editorial Commentary</h4>
                    <p className="text-xs text-[#4B5563]">Bilingual commentary detailing breed genetics, regional textile provenance, and handler bloodlines.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#D8EADF]/30 border border-[#0F4A2F]/10">
                  <Music className="w-5 h-5 text-[#0F4A2F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0F4A2F]">Traditional Drummers &amp; Pageantry</h4>
                    <p className="text-xs text-[#4B5563]">Kano Kakaki trumpeters, Yoruba talking drummers, and Eastern Ogene percussionists accompanying entry classes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#D8EADF]/30 border border-[#0F4A2F]/10">
                  <GraduationCap className="w-5 h-5 text-[#0F4A2F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0F4A2F]">Live Breed Education</h4>
                    <p className="text-xs text-[#4B5563]">Interactive judge explanations on conformation scorecards, milk/meat yields, and heat-tolerance traits.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#D8EADF]/30 border border-[#0F4A2F]/10">
                  <Camera className="w-5 h-5 text-[#0F4A2F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0F4A2F]">Dedicated Public Photo Zones</h4>
                    <p className="text-xs text-[#4B5563]">Specially staged, barrier-protected photo platforms allowing families and photographers close-up access.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          F. LIVESTOCK VILLAGE & ANIMAL WELFARE
      ───────────────────────────────────────────────────────────── */}
      <section id="village" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welfare Anchor Banner */}
        <div className="rounded-2xl bg-[#0F4A2F] text-white p-6 sm:p-10 mb-10 text-center shadow-md relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
          <div className="relative z-10 w-full md:w-1/2 text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4B03A] block mb-2">
              Ethical Charter
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif mb-3 text-[#FEF3D6] leading-tight">
              &ldquo;Beautiful for the audience. Comfortable for the animals.&rdquo;
            </h2>
            <p className="text-sm text-slate-300">
              Our cardinal welfare pledge. Every presentation, housing stall, and runway lap strictly adheres to certified veterinary standards.
            </p>
          </div>
          <div className="relative w-full md:w-1/2 h-64 rounded-xl overflow-hidden border-2 border-white/20">
             <Image src="/assets/fashion-parade/veterinarian-examining-dairy-cow.jpg" alt="Veterinarian examining cow" fill className="object-cover" />
          </div>
        </div>

        {/* Two-Column Operational Architecture Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Village Infrastructure */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#0F4A2F]/15 p-8 shadow-card space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#0F4A2F]/10">
              <div className="w-10 h-10 rounded-xl bg-[#D8EADF] flex items-center justify-center text-[#0F4A2F] shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F4A2F] font-serif">Village Infrastructure</h3>
                <p className="text-xs text-[#6B7280]">Purpose-built temporary habitat at Abuja National Grounds</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#0F4A2F]/10 flex items-start gap-3.5">
                <SunMedium className="w-5 h-5 text-[#0F4A2F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0F4A2F]">Shaded Cross-Ventilated Pens</h4>
                  <p className="text-xs text-[#4B5563] mt-0.5">High-roof pavilions with natural thatch membranes providing a 5°C ambient temperature reduction.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#0F4A2F]/10 flex items-start gap-3.5">
                <Droplet className="w-5 h-5 text-[#0F4A2F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0F4A2F]">Clean Continuous Water Troughs</h4>
                  <p className="text-xs text-[#4B5563] mt-0.5">Automated freshwater stations and electrolyte hydration docks monitored hourly by site stewards.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#0F4A2F]/10 flex items-start gap-3.5">
                <Activity className="w-5 h-5 text-[#0F4A2F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0F4A2F]">Dedicated Veterinary Inspection Corridors</h4>
                  <p className="text-xs text-[#4B5563] mt-0.5">Direct, non-crowded medical transit routes connecting all stables to the on-site clinic.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#0F4A2F]/10 flex items-start gap-3.5">
                <Recycle className="w-5 h-5 text-[#0F4A2F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0F4A2F]">Sanitary Waste Management</h4>
                  <p className="text-xs text-[#4B5563] mt-0.5">Continuous bio-compost bagging, deodorizing wood shavings, and zero-runoff drainage systems.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 10 Welfare Commitments */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#0F4A2F]/15 p-8 shadow-card space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#0F4A2F]/10">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3D6] flex items-center justify-center text-[#0F4A2F] shrink-0 border border-[#E4B03A]/30">
                <ShieldCheck className="w-5 h-5 text-[#9E7519]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F4A2F] font-serif">10 Welfare Commitments</h3>
                <p className="text-xs text-[#6B7280]">Mandatory operational standards enforced system-wide</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1F2937] font-medium">
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>Certified Animal Handlers Only</span>
              </div>
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>Non-Restrictive Breathable Drapes</span>
              </div>
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>24/7 On-Site Veterinary Care</span>
              </div>
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>Visitor Separation Barriers</span>
              </div>
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>Zero Adhesives &amp; Zero Body Paints</span>
              </div>
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>Mandatory Pre-Runway Health Check</span>
              </div>
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>Cooling Misting Zones at Stalls</span>
              </div>
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>Noise Capping near Animal Dens</span>
              </div>
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>Natural Perch Structures for Birds</span>
              </div>
              <div className="p-3 rounded-lg bg-[#D8EADF]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F4A2F] shrink-0" />
                <span>Rapid Response Medical Evacuation</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] font-semibold text-[#6B7280]">
                Audited independently by Federal Veterinary Officers.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          G. INTERACTIVE EDUCATION & BREED SEARCH
      ───────────────────────────────────────────────────────────── */}
      <section id="directory" className="w-full py-20 bg-white border-y border-[#0F4A2F]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Visitor Journey Banner */}
          <div className="rounded-2xl bg-[#FBFBFA] border border-[#0F4A2F]/15 p-6 sm:p-8 mb-16 shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#9E7519] text-center mb-4">
              Visitor Learning Pathway
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-white border border-[#0F4A2F]/10 shadow-xs">
                <span className="text-xs font-black text-[#0F4A2F] block mb-1">01. SEE</span>
                <span className="text-xs text-[#4B5563]">Spectacular pageantry on the runway</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#0F4A2F]/10 shadow-xs">
                <span className="text-xs font-black text-[#0F4A2F] block mb-1">02. LEARN</span>
                <span className="text-xs text-[#4B5563]">Scientific breed conformation signage</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#0F4A2F]/10 shadow-xs">
                <span className="text-xs font-black text-[#0F4A2F] block mb-1">03. EXPERIENCE</span>
                <span className="text-xs text-[#4B5563]">Guided village walks and photo zones</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#0F4A2F]/10 shadow-xs">
                <span className="text-xs font-black text-[#0F4A2F] block mb-1">04. CONNECT</span>
                <span className="text-xs text-[#4B5563]">Direct linkages with breeder cooperatives</span>
              </div>
            </div>
          </div>

          {/* Searchable Breed Directory Title */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F4A2F] tracking-tight font-serif mb-2">
              Searchable Breed Directory
            </h2>
            <p className="text-sm text-[#4B5563]">
              Filter by geographic origin and production purpose. Click any entry to inspect its Animal Shed Signage Board.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {/* Origin Filters */}
            <div className="inline-flex rounded-xl bg-[#FBFBFA] p-1 border border-[#0F4A2F]/15 text-xs font-bold">
              {[
                { id: 'all', label: 'All Origins' },
                { id: 'Local/Nigerian', label: 'Local Nigerian' },
                { id: 'West African', label: 'West African' },
                { id: 'Exotic', label: 'Exotic' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setOriginFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    originFilter === opt.id
                      ? 'bg-[#0F4A2F] text-white shadow-xs'
                      : 'text-[#4B5563] hover:text-[#0F4A2F]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Purpose Filters */}
            <div className="inline-flex rounded-xl bg-[#FBFBFA] p-1 border border-[#0F4A2F]/15 text-xs font-bold">
              {[
                { id: 'all', label: 'All Purposes' },
                { id: 'Dairy', label: 'Dairy' },
                { id: 'Meat', label: 'Meat' },
                { id: 'Traction', label: 'Traction' },
                { id: 'Exhibition', label: 'Exhibition' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPurposeFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    purposeFilter === opt.id
                      ? 'bg-[#E4B03A] text-[#1F2937] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#0F4A2F]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Directory Layout: Breed List (Left) + Interactive Signage Preview (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Breed Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredBreeds.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-2 p-8 text-center bg-[#FBFBFA] rounded-2xl border border-[#0F4A2F]/10"
                  >
                    <p className="text-sm font-bold text-[#0F4A2F]">No breeds found matching the selected filter combination.</p>
                    <p className="text-xs text-[#4B5563] mt-1">Try resetting the origin or purpose filters above.</p>
                  </motion.div>
                ) : (
                  filteredBreeds.map((breed) => {
                    const isSelected = selectedBreed.id === breed.id;
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={breed.id}
                        onClick={() => setSelectedBreed(breed)}
                        className={`p-5 rounded-2xl bg-[#FBFBFA] border transition-all cursor-pointer flex flex-col justify-between group shadow-card hover:shadow-card-hover ${
                          isSelected
                            ? 'border-[#0F4A2F] ring-2 ring-[#0F4A2F]/20'
                            : 'border-[#0F4A2F]/15'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-[#0F4A2F] uppercase tracking-wider px-2 py-0.5 rounded bg-[#D8EADF]">
                              {breed.origin}
                            </span>
                            <span className="text-[10px] font-bold text-[#9E7519] uppercase">
                              {breed.purpose}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-[#0F4A2F] group-hover:text-[#1B6543] transition-colors font-serif mb-1">
                            {breed.name}
                          </h4>
                          <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed mb-4">
                            {breed.traits}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-[#0F4A2F]/10 flex items-center justify-between text-[11px] font-bold text-[#0F4A2F]">
                          <span>Inspect Placard</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Right: Info Board Template (Interactive Preview of Animal Shed Signage) */}
            <div className="lg:col-span-5 sticky top-28">
              <div className="rounded-2xl bg-[#FBFBFA] border-2 border-[#0F4A2F]/20 shadow-card-hover relative overflow-hidden flex flex-col">
                {/* Signage Top Image Preview */}
                <div className="w-full h-48 relative border-b border-[#0F4A2F]/15">
                  <Image src={selectedBreed.image} alt={selectedBreed.name} fill className="object-cover" />
                </div>
                
                <div className="p-6 sm:p-8">
                  {/* Signage Header Strip */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#0F4A2F]/15 mb-6">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#9E7519]" />
                      <span className="text-[11px] font-black tracking-widest uppercase text-[#0F4A2F]">
                        Animal Shed Signage Board
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#6B7280] bg-white border border-[#0F4A2F]/10 px-2 py-0.5 rounded">
                      Official Pavilion Placard
                    </span>
                  </div>

                  {/* Signage Content */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-[#9E7519] uppercase tracking-wider block mb-1">
                        {selectedBreed.category}
                      </span>
                      <h3 className="text-2xl font-black text-[#0F4A2F] font-serif">
                        {selectedBreed.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-[#0F4A2F]/10">
                        <span className="text-[10px] font-bold text-[#6B7280] uppercase block">Origin</span>
                        <span className="font-bold text-[#0F4A2F]">{selectedBreed.origin}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#0F4A2F]/10">
                        <span className="text-[10px] font-bold text-[#6B7280] uppercase block">Production Focus</span>
                        <span className="font-bold text-[#0F4A2F]">{selectedBreed.purpose}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#0F4A2F]/10">
                      <span className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                        Key Conformation &amp; Adaptive Traits
                      </span>
                      <p className="text-xs text-[#1F2937] leading-relaxed">
                        {selectedBreed.traits}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#0F4A2F]/10">
                      <span className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                        National Economic Value
                      </span>
                      <p className="text-xs text-[#1F2937] leading-relaxed">
                        {selectedBreed.economic}
                      </p>
                    </div>

                    {/* QR Code & Verification Lockup */}
                    <div className="pt-4 border-t border-[#0F4A2F]/15 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-[#0F4A2F] text-[#E4B03A] flex items-center justify-center font-mono text-xs font-bold">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div className="text-[10px]">
                          <p className="font-bold text-[#0F4A2F]">Digital Studbook ID</p>
                          <p className="text-[#6B7280]">Scan at stall for pedigree registry</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                        Vet Certified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          H. PHOTO GALLERY
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8EADF] text-[#0F4A2F] text-xs font-bold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Captured Moments</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F4A2F] tracking-tight font-serif mb-2">
            The Parade in Pictures
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            A glimpse of the pageantry, pride, and national heritage on display.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-card group">
            <Image src="/assets/fashion-parade/dromedary-camels-carnival-ground.jpg" alt="Dromedary camels on carnival ground" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F4A2F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-bold text-sm">Desert Caravans</span>
            </div>
          </div>
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-card group">
            <Image src="/assets/fashion-parade/balami-ram-and-goat-shed.jpg" alt="Balami ram and goat" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F4A2F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-bold text-sm">Championship Ruminants</span>
            </div>
          </div>
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-card group">
            <Image src="/assets/fashion-parade/handler-beside-sokoto-gudali.jpg" alt="Handler beside Sokoto Gudali" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F4A2F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-bold text-sm">Sokoto Gudali Display</span>
            </div>
          </div>
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-card group">
            <Image src="/assets/fashion-parade/rabbits-in-ankara-hutch.jpg" alt="Rabbits in Ankara hutch" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F4A2F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-bold text-sm">Ankara Adorned Hutches</span>
            </div>
          </div>
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-card group">
            <Image src="/assets/fashion-parade/ostrich-standing-grassland.jpg" alt="Ostrich standing in grassland" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F4A2F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-bold text-sm">Exotic Exhibitions</span>
            </div>
          </div>
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-card group">
            <Image src="/assets/fashion-parade/handler-displaying-livestock-outdoors.jpg" alt="Handler displaying livestock outdoors" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F4A2F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-bold text-sm">Cultural Showmanship</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          I. ENTRY PASS & REGISTRATION ANCHOR
      ───────────────────────────────────────────────────────────── */}
      <section id="pass" className="w-full pb-20 pt-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-[#0F4A2F] text-white p-8 sm:p-14 lg:p-16 shadow-2xl relative overflow-hidden border border-[#E4B03A]/30 text-center flex flex-col items-center">
          <div className="relative z-10 max-w-2xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E4B03A] text-xs font-bold uppercase tracking-widest mb-4 border border-white/15">
              <Ticket className="w-3.5 h-3.5" />
              <span>Public Accreditation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif mb-4 text-[#FEF3D6]">
              Claim Your Free Entry Pass
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-8 max-w-xl">
              Complimentary public admission for families, agribusiness investors, students, and culture enthusiasts at Abuja National Grounds, November 21–23, 2026.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://pass.livestockcarnival.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-[#E4B03A] hover:bg-[#F5D076] text-[#1F2937] font-black text-sm uppercase tracking-wider shadow-button hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Register for Free Gate Pass</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="#hero"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm uppercase tracking-wider border border-white/20 transition-all"
              >
                Back to Top
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
