'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Globe,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  ExternalLink,
  Building2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Landmark,
  Scale,
  Award,
} from 'lucide-react';
import { editorialEase, staggerParent, staggerChildItem } from '@/lib/motion';

// ── Strategic Objectives Data ──
const strategicObjectives = [
  {
    id: 'investment',
    number: '01',
    title: 'Mobilize Investment',
    statement:
      'Securing over $12 billion in domestic and foreign direct investment into bankable agro-industrial projects.',
    elaboration:
      'Catalyzing public-private partnerships, sovereign financing windows, Sukuk-backed pastoral infrastructure, and modern agro-processing clusters across the six geopolitical zones.',
    icon: TrendingUp,
    accentColor: '#D4AF37',
    tag: 'Capital Mobilization',
  },
  {
    id: 'exports',
    number: '02',
    title: 'Export & Value Chains',
    statement:
      'Converting raw potential into higher-value exports and opening international markets across Africa, the Middle East, and Asia.',
    elaboration:
      'Transitioning Nigeria from raw commodity trading to high-grade packaged cuts, processed leather goods, and certified dairy, fully compliant with AfCFTA and GCC Halal protocols.',
    icon: Globe,
    accentColor: '#1E4D38',
    tag: 'Global Trade Corridors',
  },
  {
    id: 'jobs',
    number: '03',
    title: 'Job Creation',
    statement:
      'Creating millions of new opportunities for Nigerian youth across the agricultural and manufacturing value chains.',
    elaboration:
      'Generating sustainable employment across humane livestock rearing, veterinary sciences, refrigerated cold-chain logistics, packaging technologies, and retail commerce.',
    icon: Briefcase,
    accentColor: '#8D6B1B',
    tag: 'Socioeconomic Impact',
  },
  {
    id: 'institution',
    number: '04',
    title: 'Institutional Foundation',
    statement:
      'Laying the regulatory and operational groundwork for a highly competitive, globally recognized Nigerian Halal ecosystem.',
    elaboration:
      'Establishing unified national certification guidelines, international mutual recognition agreements (MRAs), robust sanitary safeguards, and integrity-first accreditation bodies.',
    icon: ShieldCheck,
    accentColor: '#0F766E',
    tag: 'Governance & Integrity',
  },
];

// ── Four Pillars of the $7T Economy ──
const economyPillars = [
  {
    title: 'Halal Food & Agriculture',
    value: '$2.2 Trillion Global',
    desc: 'Humane abattoirs, farm-to-fork traceability, hygienic cold chain, and organic feed management.',
  },
  {
    title: 'Islamic Finance & Sukuk',
    value: '$3.5 Trillion Global',
    desc: 'Non-interest capital pools, asset-backed bonds, and risk-sharing agribusiness investment instruments.',
  },
  {
    title: 'Halal Logistics & Cold Chain',
    value: '$800+ Billion Global',
    desc: 'End-to-end Tayyib supply chains ensuring segregated transport, hygienic storage, and export speed.',
  },
  {
    title: 'Digital Standards & Commerce',
    value: '$500+ Billion Global',
    desc: 'Blockchain-based livestock tagging, e-certification portals, and cross-border trade settlements.',
  },
];

export default function NhesicsPage() {
  return (
    <div className="w-full bg-[#FBFBFA] text-[#111827] selection:bg-[#D4AF37]/30 selection:text-[#111827]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION: Dark Obsidian / Deep Sage with Gold Accents
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#111827] via-[#1E4D38] to-[#111827] pt-32 pb-24 md:pt-40 md:pb-32 text-white">
        {/* Ambient Subtle Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Unboxed Eyebrow / Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: editorialEase }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="text-xs sm:text-sm font-black tracking-[0.25em] text-[#D4AF37] uppercase">
              RENEWED HOPE AGENDA · STRATEGIC MANDATE
            </span>
          </motion.div>

          {/* Page Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: editorialEase }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-6 font-serif"
          >
            NHESICS: National Halal Economy Strategy Implementation Committee Secretariat
          </motion.h1>

          {/* Mission Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: editorialEase }}
            className="text-lg sm:text-xl md:text-2xl text-[#FEF3D6] font-medium leading-relaxed max-w-3xl mb-12"
          >
            &ldquo;Positioning Nigeria as a leader in the $7 trillion global Halal economy spanning food, finance, logistics, and digital commerce.&rdquo;
          </motion.p>

          {/* Key Metric Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: editorialEase }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left"
          >
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] block mb-1 font-serif">
                $7T
              </span>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Global Market Size
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] block mb-1 font-serif">
                $12B+
              </span>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Targeted Investment
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] block mb-1 font-serif">
                Millions
              </span>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Youth Jobs Targeted
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] block mb-1 font-serif">
                36 + FCT
              </span>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nationwide Footprint
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. KEY STRATEGIC OBJECTIVES (BENTO GRID WITH FRAMER MOTION)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3D6] border border-[#FCE6A8] text-[#8D6B1B] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            <Landmark className="w-3.5 h-3.5" />
            <span>Strategic Pillars of Delivery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight mb-4 font-serif">
            Key Objectives &amp; National Deliverables
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            NHESICS operates across four core mandates to dismantle structural bottlenecks, harmonize
            standards, and unlock massive capital flows for Nigeria&apos;s livestock and agribusiness ecosystem.
          </p>
        </div>

        {/* 4 Cards Grid with Staggered Framer Motion Reveal */}
        <motion.div
          variants={staggerParent}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {strategicObjectives.map((obj) => {
            const Icon = obj.icon;
            return (
              <motion.div
                key={obj.id}
                variants={staggerChildItem}
                className="bg-white rounded-2xl p-8 sm:p-10 shadow-card hover:shadow-card-hover border border-slate-200/90 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Accent Top Border */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
                  style={{ backgroundColor: obj.accentColor }}
                />

                <div>
                  {/* Card Meta Header */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8D6B1B]" />
                      {obj.tag}
                    </span>
                    <span className="text-2xl font-black text-slate-300 font-serif">
                      {obj.number}
                    </span>
                  </div>

                  {/* Objective Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: `${obj.accentColor}18`, color: obj.accentColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#111827] group-hover:text-[#1E4D38] transition-colors">
                      {obj.title}
                    </h3>
                  </div>

                  {/* Core Statement (Prompt Mandate) */}
                  <blockquote className="p-4 rounded-xl bg-[#FBFBFA] border-l-4 border-[#D4AF37] mb-5">
                    <p className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                      &ldquo;{obj.statement}&rdquo;
                    </p>
                  </blockquote>

                  {/* Elaboration */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    {obj.elaboration}
                  </p>
                </div>

                {/* Footer Checkmark */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#1E4D38]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Integrated with Presidential Mandate &amp; Ministry of Livestock Development</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTORAL VALUE BREAKDOWN: The $7T Global Halal Spectrum
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-[#8D6B1B] uppercase block mb-2">
              Global Economic Horizon
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-3 font-serif">
              Unlocking Four Growth Sectors for Nigeria
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              The Halal economy is far broader than religious observance; it is a global benchmark
              for purity, ethical sourcing, hygienic processing, and sustainable finance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {economyPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FBFBFA] border border-slate-200/90 shadow-xs hover:shadow-card transition-all"
              >
                <span className="text-xs font-black tracking-wider uppercase text-[#1E4D38] block mb-1">
                  {pillar.value}
                </span>
                <h3 className="text-lg font-bold text-[#111827] mb-2 font-serif">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PROMINENT EXTERNAL CTA SECTION (Mandate #3)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#1E4D38] to-[#111827] text-white p-8 sm:p-14 lg:p-16 shadow-2xl relative overflow-hidden border border-white/10 flex flex-col items-center">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl flex flex-col items-center">
            {/* Coat of Arms Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#FEF3D6] uppercase">
                Official Federal Portal
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-serif">
              Discover the National Halal Strategy
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              Access official documentation, policy whitepapers, bilateral investment guidelines,
              and enterprise certification frameworks directly from the Secretariat.
            </p>

            {/* MANDATORY SOLID GOLD CTA BUTTON */}
            <a
              href="https://nhesics.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D4AF37] text-[#111827] rounded-xl shadow-button hover:-translate-y-1 transition-transform px-8 py-4 sm:px-10 sm:py-4.5 font-black text-sm sm:text-base tracking-wide flex items-center gap-3 cursor-pointer group"
            >
              <span>CLICK HERE to learn more about NHESICS</span>
              <ExternalLink className="w-5 h-5 text-[#111827] group-hover:scale-110 transition-transform" />
            </a>


          </div>
        </div>
      </section>
    </div>
  );
}
