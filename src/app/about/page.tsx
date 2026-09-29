import { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import { Activity, ShieldCheck, Wifi, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import ThreeDCard from "@/components/motion/ThreeDCard";

export const metadata: Metadata = {
  title: "About & Mandate | Renewed Hope National Livestock Carnival 2026",
  description:
    "Official Presidential mandate and strategic policy framework transforming Nigeria's livestock sector into a multi-billion dollar export powerhouse.",
};

export default function About() {
  return (
    <main className="flex min-h-screen flex-col bg-[#FBFBFA] pt-24 pb-24 overflow-x-hidden">

      {/* ── 1. Cinematic Hero Banner ── */}
      <section className="relative w-full py-24 md:py-32 text-center px-6 overflow-hidden">
        {/* Ambient gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#D8EADF]/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-[#FEF3D6]/35 rounded-full blur-[90px] pointer-events-none translate-y-1/3" />

        <div className="relative max-w-4xl mx-auto z-10">
          <ScrollReveal direction="zoom" delay={0}>
            <span className="text-xs font-bold tracking-[0.3em] text-[#8D6B1B] uppercase inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-[#E4B03A] inline-block" />
              Presidential Mandate &amp; Vision
              <span className="w-8 h-px bg-[#E4B03A] inline-block" />
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1} duration={1.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] mb-6 leading-[1.08] tracking-tight">
              Transforming Nigeria&apos;s Livestock Economy Into a
              <span className="text-[#1E4D38]"> Global Export Powerhouse</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2} duration={1.0}>
            <p className="text-base md:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
              Operating in alignment with national economic renewal mandates, the 2026 Pilot Staging establishes sustainable pastoral corridors, certified quality processing standards, and concessionary industrial financing.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2. Three Strategic Pillars ── */}
      <section className="w-full py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <ScrollReveal direction="up" delay={0}>
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-[0.22em] text-[#1E4D38] uppercase block mb-2">
                Core Framework
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827]">
                Three Strategic Pillars of Transformation
              </h2>
              <div className="w-16 h-0.5 bg-[#E4B03A] mx-auto mt-4" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                color: 'bg-[#D8EADF]',
                iconColor: 'text-[#1E4D38]',
                title: 'Genetic Excellence & Breed Studbook',
                desc: 'Implementing purebred evaluation programs for Bunaji, Sokoto Gudali, Red Bororo, and Sahelian camels to boost meat yield, disease resistance, and reproductive vigor.',
              },
              {
                icon: ShieldCheck,
                color: 'bg-[#FEF3D6]',
                iconColor: 'text-[#8D6B1B]',
                title: 'Quality & Safety Infrastructure (QSI)',
                desc: 'Codifying hygiene standards, cold-chain preservation protocols, and bilateral export accreditation to access international agri-export corridors.',
              },
              {
                icon: Wifi,
                color: 'bg-[#D8EADF]',
                iconColor: 'text-[#1E4D38]',
                title: 'Digital Traceability & Live-Weight Scaling',
                desc: 'Replacing arbitrary visual bargaining with certified digital kilogram scales, RFID biometric telematics, and farm-to-plate export provenance ledgers.',
              },
            ].map((pillar, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.15} duration={0.9}>
                <ThreeDCard variant="light" maxTilt={12} depth={26} className="h-full">
                  <div className="p-8 h-full flex flex-col [transform-style:preserve-3d]">
                    <div
                      style={{ transform: 'translateZ(35px)' }}
                      className={`w-12 h-12 rounded-2xl ${pillar.color} ${pillar.iconColor} flex items-center justify-center mb-6 shadow-sm`}
                    >
                      <pillar.icon className="w-6 h-6" />
                    </div>
                    <div style={{ transform: 'translateZ(20px)' }}>
                      <h3 className="text-xl font-bold text-[#111827] mb-3">{pillar.title}</h3>
                      <p className="text-sm text-[#4B5563] leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                </ThreeDCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BOI Financing Section ── */}
      <section id="financing" className="w-full py-16 md:py-24 bg-[#F7F9F8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="right" duration={1.0}>
              <div className="space-y-6">
                <span className="text-xs font-bold tracking-[0.22em] text-[#8D6B1B] uppercase block">
                  Agro-Industrial Capital Facility
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight">
                  Bank of Industry (BOI) Corporate Sponsorship &amp; Financing Facility
                </h2>
                <div className="w-12 h-0.5 bg-[#E4B03A]" />
                <p className="text-base text-[#4B5563] leading-relaxed">
                  Structured in strategic alignment with national development lenders, the Agri-Transform window unlocks concessionary financing, asset leasing, and strategic sponsorship benefits for commercial pastoralists, feedlots, and cold chain operators.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-[#1E4D38] hover:bg-[#163B2B] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    <span>Inquire for Corporate Sponsorship</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" duration={1.0} delay={0.1}>
              <ThreeDCard variant="light" maxTilt={8} depth={20} className="relative overflow-hidden">
                <div className="p-8 md:p-10 [transform-style:preserve-3d]">
                  {/* Gold shimmer accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E4B03A] to-transparent" />
                  <h3
                    style={{ transform: 'translateZ(30px)' }}
                    className="text-xl font-extrabold text-[#111827] mb-6 pb-4 border-b border-gray-100"
                  >
                    Corporate Sponsorship &amp; Partner Benefits
                  </h3>
                  <ul className="space-y-5">
                    {[
                      { color: 'text-[#8D6B1B]', title: 'Agro-Industrial Asset Financing', desc: 'Concessional equipment leasing for commercial feedlots, mobile abattoirs, and cold chain logistics.' },
                      { color: 'text-[#1E4D38]', title: 'Concessionary Credit Terms', desc: 'Subsidized borrowing structure and priority access for certified pastoral and processing operators.' },
                      { color: 'text-[#8D6B1B]', title: 'Flexible Repayment Tenor', desc: 'Structured repayment holidays tailored specifically to livestock breeding and fattening cycles.' },
                      { color: 'text-[#1E4D38]', title: 'Brand Exposure', desc: 'VIP arena branding, ministerial trade briefings, and national media coverage across all festival zones.' },
                    ].map((item, i) => (
                      <li
                        key={i}
                        style={{ transform: `translateZ(${15 + i * 4}px)` }}
                        className="flex items-start space-x-3.5"
                      >
                        <CheckCircle className={`w-5 h-5 ${item.color} shrink-0 mt-0.5`} />
                        <div>
                          <h4 className="text-sm font-bold text-[#111827]">{item.title}</h4>
                          <p className="text-xs text-[#4B5563] mt-0.5">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </ThreeDCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 4. 2027 Zonal Expansion Roadmap ── */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.22em] text-[#8D6B1B] uppercase block mb-3">
                Expansion Blueprint
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4">
                2027 Six-Zone National Rollout
              </h2>
              <div className="w-16 h-0.5 bg-[#E4B03A] mx-auto mb-4" />
              <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
                While the 2026 inaugural pilot is centralized in Abuja at the Old Parade Ground, the roadmap transitions into a synchronized multi-zone festival in 2027:
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { zone: "North-West", state: "Kano Hub", desc: "Purebred genetics breeding, trans-Sahel auctions & commercial feedlots." },
              { zone: "North-East", state: "Adamawa Hub", desc: "Gudali preservation, border veterinary quarantine & expansive rangelands." },
              { zone: "North-Central", state: "Niger Hub", desc: "Commercial dairy pasture, fodder cropping & hydro-irrigated rangelands." },
              { zone: "South-West", state: "Ogun Hub", desc: "Industrial abattoir networks & high-volume consumer distribution terminals." },
              { zone: "South-East", state: "Imo Hub", desc: "Small ruminant trading, regional poultry hubs & cold redistribution staging." },
              { zone: "South-South", state: "Delta Hub", desc: "Maritime deep-sea cold reefer terminals & direct Middle Eastern export berths." },
            ].map((item, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.1} duration={0.85}>
                <ThreeDCard variant="light" maxTilt={10} depth={20} className="h-full">
                  <div className="p-6 flex items-start space-x-4 h-full [transform-style:preserve-3d]">
                    <div
                      style={{ transform: 'translateZ(30px)' }}
                      className="bg-[#D8EADF] p-3.5 rounded-2xl shadow-sm shrink-0 flex items-center justify-center text-[#1E4D38]"
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div style={{ transform: 'translateZ(20px)' }}>
                      <span className="text-[11px] font-bold text-[#8D6B1B] uppercase tracking-wider block mb-1">{item.zone}</span>
                      <h4 className="text-lg font-bold text-[#111827] mb-1.5">{item.state}</h4>
                      <p className="text-xs text-[#4B5563] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </ThreeDCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
