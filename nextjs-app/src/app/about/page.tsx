import { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import { Activity, ShieldCheck, Wifi, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About & Mandate | Renewed Hope National Livestock Carnival 2026",
  description:
    "Official Presidential mandate and strategic policy framework transforming Nigeria's livestock sector into a multi-billion dollar export powerhouse.",
};

export default function About() {
  return (
    <main className="flex min-h-screen flex-col bg-[#FBFBFA] pt-24 pb-24">
      {/* 1. Hero Banner */}
      <section className="w-full py-16 md:py-24 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold tracking-[0.25em] text-[#8D6B1B] uppercase block mb-4">
            Presidential Mandate &amp; Vision
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] mb-6 leading-tight">
            Transforming Nigeria's Livestock Economy Into a Global Export Powerhouse
          </h1>
          <p className="text-base md:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Operating in alignment with national economic renewal mandates, the 2026 Pilot Staging establishes sustainable pastoral corridors, certified quality processing standards, and concessionary industrial financing.
          </p>
        </div>
      </section>

      {/* 2. Three Strategic Pillars */}
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-[#1E4D38] uppercase block mb-2">
              Core Framework
            </span>
            <h2 className="text-3xl font-extrabold text-[#111827]">
              Three Strategic Pillars of Transformation
            </h2>
          </div>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#D8EADF] text-[#1E4D38] flex items-center justify-center mb-6 shadow-sm">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">
                  Genetic Excellence &amp; Breed Studbook
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Implementing purebred evaluation programs for Bunaji, Sokoto Gudali, Red Bororo, and Sahelian camels to boost meat yield, disease resistance, and reproductive vigor.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3D6] text-[#8D6B1B] flex items-center justify-center mb-6 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">
                  Quality &amp; Safety Infrastructure (QSI)
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Codifying hygiene standards, cold-chain preservation protocols, and bilateral export accreditation to access international agri-export corridors.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#D8EADF] text-[#1E4D38] flex items-center justify-center mb-6 shadow-sm">
                  <Wifi className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">
                  Digital Traceability &amp; Live-Weight Scaling
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Replacing arbitrary visual bargaining with certified digital kilogram scales, RFID biometric telematics, and farm-to-plate export provenance ledgers.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. BOI Financing Section - Focus purely on Benefits without specific amounts */}
      <section id="financing" className="w-full py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="space-y-6">
                <span className="text-xs font-bold tracking-[0.2em] text-[#8D6B1B] uppercase block">
                  Agro-Industrial Capital Facility
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight">
                  Bank of Industry (BOI) Corporate Sponsorship &amp; Financing Facility
                </h2>
                <p className="text-base text-[#4B5563] leading-relaxed">
                  Structured in strategic alignment with national development lenders, the Agri-Transform window unlocks concessionary financing, asset leasing, and strategic sponsorship benefits for commercial pastoralists, feedlots, and cold chain operators.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-[#1E4D38] hover:bg-[#163B2B] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Inquire for Corporate Sponsorship</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200/80 shadow-card relative overflow-hidden">
                <h3 className="text-xl font-extrabold text-[#111827] mb-6 pb-4 border-b border-gray-100">
                  Corporate Sponsorship &amp; Partner Benefits
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-start space-x-3.5">
                    <CheckCircle className="w-5 h-5 text-[#8D6B1B] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#111827]">Agro-Industrial Asset Financing</h4>
                      <p className="text-xs text-[#4B5563] mt-0.5">Concessional equipment leasing for commercial feedlots, mobile abattoirs, and cold chain logistics.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3.5">
                    <CheckCircle className="w-5 h-5 text-[#1E4D38] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#111827]">Concessionary Credit Terms</h4>
                      <p className="text-xs text-[#4B5563] mt-0.5">Subsidized borrowing structure and priority access for certified pastoral and processing operators.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3.5">
                    <CheckCircle className="w-5 h-5 text-[#8D6B1B] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#111827]">Flexible Repayment Tenor</h4>
                      <p className="text-xs text-[#4B5563] mt-0.5">Structured repayment holidays tailored specifically to livestock breeding and fattening cycles.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3.5">
                    <CheckCircle className="w-5 h-5 text-[#1E4D38] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#111827]">Brand Exposure</h4>
                      <p className="text-xs text-[#4B5563] mt-0.5">VIP arena branding, ministerial trade briefings, and national media coverage across all festival zones.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. 2027 Zonal Expansion Roadmap */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-[#8D6B1B] uppercase block mb-3">
              Expansion Blueprint
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4">
              2027 Six-Zone National Rollout
            </h2>
            <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
              While the 2026 inaugural pilot is centralized in Abuja at the Old Parade Ground, the roadmap transitions into a synchronized multi-zone festival in 2027:
            </p>
          </div>

          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { zone: "North-West", state: "Kano Hub", desc: "Purebred genetics breeding, trans-Sahel auctions & commercial feedlots." },
                { zone: "North-East", state: "Adamawa Hub", desc: "Gudali preservation, border veterinary quarantine & expansive rangelands." },
                { zone: "North-Central", state: "Niger Hub", desc: "Commercial dairy pasture, fodder cropping & hydro-irrigated rangelands." },
                { zone: "South-West", state: "Ogun Hub", desc: "Industrial abattoir networks & high-volume consumer distribution terminals." },
                { zone: "South-East", state: "Imo Hub", desc: "Small ruminant trading, regional poultry hubs & cold redistribution staging." },
                { zone: "South-South", state: "Delta Hub", desc: "Maritime deep-sea cold reefer terminals & direct Middle Eastern export berths." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200/80 rounded-2xl bg-white p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex items-start space-x-4"
                >
                  <div className="bg-[#D8EADF] p-3.5 rounded-2xl shadow-sm shrink-0 flex items-center justify-center text-[#1E4D38]">
                    <MapPin className="w-5 h-5 text-[#1E4D38]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#8D6B1B] uppercase tracking-wider block mb-1">
                      {item.zone}
                    </span>
                    <h4 className="text-lg font-bold text-[#111827] mb-1.5">
                      {item.state}
                    </h4>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
