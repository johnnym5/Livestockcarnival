import ScrollReveal from "@/components/ScrollReveal";
import MediaPostsFeed from "@/components/MediaPostsFeed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Center | Renewed Hope National Livestock Carnival 2026",
  description:
    "Published newsroom stories from the Renewed Hope National Livestock Carnival 2026.",
};

export default function MediaCenterPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] pt-24 pb-24 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute top-20 right-1/4 w-[500px] h-[400px] bg-[#FEF3D6]/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <ScrollReveal direction="zoom" delay={0}>
            <span className="text-xs font-bold tracking-[0.28em] text-[#8D6B1B] uppercase inline-flex items-center gap-2 mb-4">
              <span className="w-6 h-px bg-[#E4B03A]" />
              Press Directorate &amp; Media Center
              <span className="w-6 h-px bg-[#E4B03A]" />
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.08} duration={1.1}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-5 leading-tight tracking-tight">
              Official Media Center
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.16} duration={1.0}>
            <p className="text-base md:text-lg text-[#4B5563] leading-relaxed">
              Read published updates from the National Livestock Carnival newsroom.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <div className="w-16 h-0.5 bg-[#E4B03A] mx-auto mt-6" />
          </ScrollReveal>
        </div>

        <div className="space-y-24">
          {/* Press Releases */}
          <section>
            <ScrollReveal direction="right" delay={0}>
              <div className="flex items-center justify-between mb-8 border-b border-[#E5E7EB] pb-4">
                <h2 className="text-2xl font-extrabold text-[#111827]">Published Stories</h2>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8D6B1B]">Newsroom</span>
              </div>
            </ScrollReveal>
            <MediaPostsFeed />
          </section>
        </div>
      </div>
    </main>
  );
}
