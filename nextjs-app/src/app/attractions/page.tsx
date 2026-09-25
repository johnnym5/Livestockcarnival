import Image from "next/image";
import Link from "next/link";
import { Check, MapPin, ArrowRight } from "lucide-react";
import attractions from "@/data/attractions.json";
import ScrollReveal from "@/components/ScrollReveal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Festival Attractions & Arenas | Renewed Hope National Livestock Carnival 2026",
  description:
    "Explore the 5 signature festival zones at Old Parade Ground, Abuja: Royal Durbar, Fresh Meat & Scale Market, Twilight Suya Village, Championship Breed Judging, and Traceability Hub.",
};

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

        <div className="space-y-16">
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
      </div>
    </main>
  );
}
