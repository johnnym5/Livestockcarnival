import Image from "next/image";
import Link from "next/link";
import { Check, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import attractions from "@/data/attractions.json";
import ScrollReveal from "@/components/ScrollReveal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Festival Attractions & Arenas | Renewed Hope National Livestock Carnival 2026",
  description:
    "Explore the signature festival zones and national livestock spectrum at Old Parade Ground, Abuja: Royal Durbar, Fresh Meat Market, Suya Village, Breed Judging, and Traceability Hub.",
};

const livestockList = [
  {
    id: 'bull-cow',
    name: 'Bulls & Cattle',
    species: 'White Fulani · Sokoto Gudali · Bunaji',
    description: 'Prized sovereign genetics, conformation judging, and live-weight precision trading.',
    image: '/assets/livestock_bull_cow.jpg',
    tag: 'Elite Genetics',
  },
  {
    id: 'camel',
    name: 'Golden Camels',
    species: 'Sahelian Dromedary · Royal Caravans',
    description: 'Centuries of desert heritage, pageantry racing, and milk/meat exhibition.',
    image: '/assets/livestock_camel.jpg',
    tag: 'Royal Heritage',
  },
  {
    id: 'goat-sheep',
    name: 'Goats & Sheep',
    species: 'Red Sokoto · Yankasa · West African Dwarf',
    description: 'Premier small ruminant auctions, artisanal leather, and breeding studbooks.',
    image: '/assets/livestock_goat_sheep.jpg',
    tag: 'Small Ruminants',
  },
  {
    id: 'poultry',
    name: 'Poultry & Birds',
    species: 'Indigenous Chickens · Ducks · Broilers',
    description: 'Commercial aviculture incubation, free-range feed systems, and farm-gate supply.',
    image: '/assets/livestock_poultry.jpg',
    tag: 'Commercial Aviculture',
  },
  {
    id: 'aquaculture',
    name: 'Fish & Aquaculture',
    species: 'African Catfish · Tilapia · Aqua-culture',
    description: 'High-density tank systems, fingerling hatcheries, and maritime cold-chain export.',
    image: '/assets/livestock_aquaculture.jpg',
    tag: 'Blue Economy',
  },
];

export default function AttractionsPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.25em] text-[#8D6B1B] uppercase block mb-3">
            Festival Arenas &amp; Signature Hubs
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6 leading-tight">
            Immersive Public Attractions
          </h1>
          <p className="text-base md:text-lg text-[#4B5563] leading-relaxed">
            Experience the full spectrum of Nigerian pastoral pageantry, artisanal gastronomy, live-weight trading demonstrations, and global export certification.
          </p>
        </div>

        {/* 1. Primary Festival Arenas */}
        <div className="space-y-16 mb-24">
          {attractions.map((attraction: any, index: number) => (
            <ScrollReveal key={attraction.id} animation="fade-up" delay={index * 0.08}>
              <div
                id={attraction.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 lg:p-12 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image Column */}
                  <div className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#D8EADF] shadow-md border border-slate-200/60 group">
                      <Image
                        src={attraction.image || "/assets/placeholder.jpg"}
                        alt={attraction.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="inline-flex items-center space-x-2 bg-[#FEF3D6] text-[#8D6B1B] px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{attraction.zone}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mb-2 leading-tight">
                      {attraction.title}
                    </h2>
                    <p className="text-base text-[#8D6B1B] font-semibold mb-4">
                      {attraction.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-[#4B5563] mb-6 leading-relaxed">
                      {attraction.summary}
                    </p>

                    <ul className="space-y-3 mb-8 border-t border-gray-100 pt-6">
                      {attraction.features?.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start text-xs sm:text-sm text-[#4B5563]">
                          <Check className="w-4 h-4 text-[#1E4D38] mr-2.5 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center text-xs font-semibold text-[#111827] bg-[#FBFBFA] border border-[#E5E7EB] px-4 py-2.5 rounded-xl shadow-sm">
                        {attraction.scheduleWindow}
                      </span>
                      <Link
                        href={`/venue-map`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1E4D38] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#163B2B] shadow-button hover:shadow-lg transition-all"
                      >
                        <span>Locate on Map</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* 2. National Livestock Spectrum Gallery Section */}
        <section className="w-full pt-12 border-t border-slate-200/80">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-[#1E4D38] uppercase bg-[#D8EADF] px-4 py-1.5 rounded-full inline-block mb-3">
              National Livestock Spectrum
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
              Celebrating Every Sector of Nigerian Livestock Wealth
            </h2>
            <p className="text-base sm:text-lg text-[#4B5563] max-w-3xl mx-auto leading-relaxed">
              The 2026 Festival unites pastoralists, breeders, poultry farmers, and fish cultivators from all 36 States and the FCT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {livestockList.map((animal) => (
              <div
                key={animal.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
              >
                <div className="relative w-full h-64 overflow-hidden bg-slate-100">
                  <Image
                    src={animal.image}
                    alt={animal.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 right-4 bg-[#111827]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    {animal.tag}
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-1.5 group-hover:text-[#1E4D38] transition-colors">
                      {animal.name}
                    </h3>
                    <div className="text-xs font-semibold text-[#8D6B1B] uppercase tracking-wider mb-3">
                      {animal.species}
                    </div>
                    <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
                      {animal.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#1E4D38]">
                      <ShieldCheck className="w-4 h-4 text-[#1E4D38]" />
                      <span>Certified Exhibition Breed</span>
                    </div>
                    <Link
                      href="/venue-map"
                      className="text-xs font-bold text-[#1E4D38] hover:text-[#8D6B1B] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Locate Stalls</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
