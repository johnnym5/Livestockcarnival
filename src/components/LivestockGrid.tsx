'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Shield, Tag, Filter, Info, X, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDCard from '@/components/motion/ThreeDCard';

export interface LivestockItem {
  id: string;
  name: string;
  breed: string | null;
  category: string;
  age: string | null;
  exhibitor: string | null;
  description: string | null;
  image_url: string;
  fallback_url?: string;
  is_featured: boolean;
  created_at?: string;
}

const LOCAL_FALLBACK_MAP: Record<string, string> = {
  'Rajputana Gold': '/assets/livestock_camel.jpg',
  'Cheetak Lineage': '/assets/durbar_horse_rider.jpg',
  'Nandi Crest': '/assets/livestock_bull_cow.jpg',
  'Sultan of Pushkar': '/assets/fashion-parade/dromedary-camels-carnival-ground.jpg',
  'Sokoto Gudali Prime': '/assets/fashion-parade/handler-beside-sokoto-gudali.jpg',
  'Balami Red Ram': '/assets/fashion-parade/balami-ram-and-goat-shed.jpg',
  'West African Dwarf Goat': '/assets/fashion-parade/goat-handler-traditional-attire.jpg',
  'Arewa Aviculture Flock': '/assets/fashion-parade/guinea-fowl-chickens-aviary.jpg',
  'Benue Catfish Showcase': '/assets/fashion-parade/catfish-and-snails-display.jpg',
};

const CATEGORIES = [
  { id: 'all', label: 'All Livestock' },
  { id: 'camels', label: 'Golden Camels' },
  { id: 'horses', label: 'Royal Cavalry' },
  { id: 'cattle', label: 'Championship Cattle' },
  { id: 'small-ruminants', label: 'Small Ruminants' },
];

export default function LivestockGrid() {
  const [items, setItems] = useState<LivestockItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModalItem, setActiveModalItem] = useState<LivestockItem | null>(null);
  const [activeImageSrcs, setActiveImageSrcs] = useState<Record<string, string>>({});
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchLivestock() {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('livestock')
          .select('*')
          .order('is_featured', { ascending: false });

        if (error || !data || data.length === 0) {
          setItems(getFallbackItems());
        } else {
          // Process records and assign local fallback images
          const processed = (data as LivestockItem[]).map((record) => {
            const fallback =
              LOCAL_FALLBACK_MAP[record.name] ||
              record.fallback_url ||
              '/assets/livestock_spectrum_hero.jpg';

            return {
              ...record,
              fallback_url: fallback,
              image_url: record.image_url && record.image_url.startsWith('/assets')
                ? record.image_url
                : fallback,
            };
          });
          setItems(processed);
        }
      } catch (err) {
        console.warn('Using local fallback dataset for livestock grid:', err);
        setItems(getFallbackItems());
      } finally {
        setLoading(false);
      }
    }

    fetchLivestock();
  }, []);

  const getImageSrc = (item: LivestockItem) => {
    if (activeImageSrcs[item.id]) {
      return activeImageSrcs[item.id];
    }
    return item.image_url || item.fallback_url || LOCAL_FALLBACK_MAP[item.name] || '/assets/livestock_camel.jpg';
  };

  const handleImageError = (item: LivestockItem) => {
    const fallback = item.fallback_url || LOCAL_FALLBACK_MAP[item.name] || '/assets/livestock_camel.jpg';
    if (activeImageSrcs[item.id] !== fallback) {
      setActiveImageSrcs((prev) => ({ ...prev, [item.id]: fallback }));
    } else {
      setImageFailed((prev) => ({ ...prev, [item.id]: true }));
    }
  };

  const filteredItems = items.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  return (
    <div className="w-full space-y-8">
      {/* Category Filter Bar in Forest Green / White System Colors */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 border-b border-slate-200/80 pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-[#1E4D38] mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Category:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#1E4D38] text-white border-[#1E4D38] shadow-md scale-105'
                : 'bg-white text-[#4B5563] border-slate-200 hover:border-[#1E4D38] hover:text-[#1E4D38] hover:bg-[#D8EADF]/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid Container */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 animate-pulse space-y-4 shadow-card"
            >
              <div className="h-56 bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-[#4B5563] shadow-card">
          <p className="text-sm uppercase font-bold tracking-wider">
            No entries found for this category.
          </p>
        </div>
      ) : (
        <div
          id="livestockGrid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item) => {
            const isFailed = imageFailed[item.id];
            const imageSrc = getImageSrc(item);

            return (
              <ThreeDCard
                key={item.id}
                variant="glass"
                glowColor="rgba(30, 77, 56, 0.15)"
                maxTilt={10}
                scaleOnHover={1.02}
                depth={20}
                className="bg-white border-slate-200/80 hover:border-[#1E4D38]/50 shadow-card hover:shadow-card-hover"
              >
                <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden [transform-style:preserve-3d]">
                  {/* Image Container */}
                  <div
                    style={{ transform: 'translateZ(15px)' }}
                    className="relative h-60 w-full overflow-hidden bg-slate-100 rounded-t-2xl"
                  >
                    {isFailed ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400 bg-slate-100 border-b border-slate-200">
                        <ImageOff className="w-10 h-10 mb-2 text-slate-400" />
                        <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                          {item.name}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={imageSrc}
                        alt={item.name}
                        onError={() => handleImageError(item)}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-106"
                      />
                    )}

                    {/* Category Badge in Sage Green */}
                    <div
                      style={{ transform: 'translateZ(35px)' }}
                      className="absolute top-3 left-3 bg-[#D8EADF]/95 backdrop-blur-md border border-[#B8D8C5] text-[#1E4D38] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm"
                    >
                      <Tag className="w-3 h-3 text-[#1E4D38]" />
                      {item.category}
                    </div>

                    {/* Featured Badge in Gold */}
                    {item.is_featured && (
                      <div
                        style={{ transform: 'translateZ(35px)' }}
                        className="absolute top-3 right-3 bg-[#FEF3D6] text-[#8D6B1B] border border-[#FCE6A8] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3 text-[#8D6B1B]" /> Grand Champion
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div
                    style={{ transform: 'translateZ(20px)' }}
                    className="p-6 flex-1 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-[#111827] group-hover:text-[#1E4D38] transition-colors">
                          {item.name}
                        </h3>
                        {item.age && (
                          <span className="text-xs text-[#8D6B1B] font-mono font-semibold">
                            {item.age}
                          </span>
                        )}
                      </div>
                      {item.breed && (
                        <p className="text-xs text-[#1E4D38] font-bold tracking-wide mb-2">
                          Breed: {item.breed}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Footer & Exhibitor info */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-[#6B7280] font-medium truncate max-w-[170px]">
                        Exhibitor: <strong className="text-[#111827]">{item.exhibitor || 'Heritage Stock'}</strong>
                      </span>
                      <button
                        onClick={() => setActiveModalItem(item)}
                        style={{ transform: 'translateZ(30px)' }}
                        className="text-xs font-bold text-[#1E4D38] hover:text-white uppercase tracking-wider flex items-center gap-1 bg-[#D8EADF] hover:bg-[#1E4D38] px-3.5 py-1.5 rounded-xl border border-[#B8D8C5] transition-all cursor-pointer shrink-0 shadow-xs"
                      >
                        Dossier <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </ThreeDCard>
            );
          })}
        </div>
      )}

      {/* Modal Popup */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 overflow-hidden shadow-2xl space-y-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-600 hover:text-[#111827] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={getImageSrc(activeModalItem)}
                  alt={activeModalItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#D8EADF] border border-[#B8D8C5] text-[#1E4D38] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {activeModalItem.category}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#111827]">
                    {activeModalItem.name}
                  </h3>
                  <span className="text-xs font-mono text-[#8D6B1B] bg-[#FEF3D6] border border-[#FCE6A8] px-3 py-1 rounded-full font-bold">
                    {activeModalItem.age || 'Age Certified'}
                  </span>
                </div>

                <div className="text-xs text-[#1E4D38] font-bold">
                  Breed: {activeModalItem.breed || 'Purebred Heritage Stock'} | Exhibitor:{' '}
                  <span className="text-[#111827] font-semibold">{activeModalItem.exhibitor || 'National Registry'}</span>
                </div>

                <p className="text-sm text-[#4B5563] leading-relaxed pt-2 border-t border-slate-100">
                  {activeModalItem.description}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-6 py-2.5 bg-[#1E4D38] hover:bg-[#163B2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-button"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getFallbackItems(): LivestockItem[] {
  return [
    {
      id: 'f1',
      name: 'Rajputana Gold',
      breed: 'Bikaneri Dromedary',
      category: 'camels',
      age: '5 Years',
      exhibitor: 'Golden Camel Estate',
      description: 'Championship breeding dromedary known for high endurance, distinctive golden coat, and grand ceremonial posture.',
      image_url: '/assets/livestock_camel.jpg',
      fallback_url: '/assets/livestock_camel.jpg',
      is_featured: true,
    },
    {
      id: 'f2',
      name: 'Cheetak Lineage',
      breed: 'Marwari Stallion',
      category: 'horses',
      age: '4 Years',
      exhibitor: 'Kano Durbar Cavalry',
      description: 'Famous inward-turning ears, athletic build, and heritage lineage trained for ceremonial Durbar parades.',
      image_url: '/assets/durbar_horse_rider.jpg',
      fallback_url: '/assets/durbar_horse_rider.jpg',
      is_featured: true,
    },
    {
      id: 'f3',
      name: 'Nandi Crest',
      breed: 'White Fulani Zebu',
      category: 'cattle',
      age: '6 Years',
      exhibitor: 'National Livestock Ranch',
      description: 'Prize-winning indigenous Zebu bull with iconic lyre-shaped horns, robust heat tolerance, and premium genetics.',
      image_url: '/assets/livestock_bull_cow.jpg',
      fallback_url: '/assets/livestock_bull_cow.jpg',
      is_featured: true,
    },
    {
      id: 'f4',
      name: 'Sultan of Pushkar',
      breed: 'Jaisalmeri Camel',
      category: 'camels',
      age: '7 Years',
      exhibitor: 'Desert Crown Stud',
      description: 'Celebrated desert racing and parade camel featuring exceptional speed, tall stature, and royal saddle dress.',
      image_url: '/assets/fashion-parade/dromedary-camels-carnival-ground.jpg',
      fallback_url: '/assets/fashion-parade/dromedary-camels-carnival-ground.jpg',
      is_featured: false,
    },
    {
      id: 'f5',
      name: 'Sokoto Gudali Prime',
      breed: 'Sokoto Gudali Bull',
      category: 'cattle',
      age: '5 Years',
      exhibitor: 'Northwest Cattle Alliance',
      description: 'Deep-bodied beef bull with smooth white coat, well-developed dewlap, and high live-weight yield certification.',
      image_url: '/assets/fashion-parade/handler-beside-sokoto-gudali.jpg',
      fallback_url: '/assets/fashion-parade/handler-beside-sokoto-gudali.jpg',
      is_featured: false,
    },
    {
      id: 'f6',
      name: 'Balami Red Ram',
      breed: 'Balami Red Sheep',
      category: 'small-ruminants',
      age: '3 Years',
      exhibitor: 'Sahel Livestock Co-op',
      description: 'Large-framed desert sheep with long pendulous ears, prized for breeding quality and heavy mutton output.',
      image_url: '/assets/fashion-parade/balami-ram-and-goat-shed.jpg',
      fallback_url: '/assets/fashion-parade/balami-ram-and-goat-shed.jpg',
      is_featured: false,
    },
    {
      id: 'f7',
      name: 'West African Dwarf Goat',
      breed: 'WAD Buck',
      category: 'small-ruminants',
      age: '2 Years',
      exhibitor: 'Humane Herd Breeders',
      description: 'Hardy indigenous dwarf goat breed renowned for trypanotolerance and exceptional prolificacy.',
      image_url: '/assets/fashion-parade/goat-handler-traditional-attire.jpg',
      fallback_url: '/assets/fashion-parade/goat-handler-traditional-attire.jpg',
      is_featured: false,
    },
  ];
}
