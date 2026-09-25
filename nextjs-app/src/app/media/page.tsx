import { FileText, AlertCircle, ArrowRight, Download } from "lucide-react";
import mediaData from "@/data/media.json";
import ScrollReveal from "@/components/ScrollReveal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Center & Press Releases | Renewed Hope National Livestock Carnival 2026",
  description:
    "Official press communiqués, brand guidelines, downloadable media packs, and accreditation rules for the 2026 Pilot Livestock Show and Agri-Export Expo in Abuja.",
};

export default function MediaCenterPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-[0.25em] text-[#8D6B1B] uppercase block mb-3">
              Press Directorate &amp; Media Center
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6 leading-tight">
              Official Media Center
            </h1>
            <p className="text-base md:text-lg text-[#4B5563] leading-relaxed">
              Access official press statements, high-resolution media asset packs, whitepapers, and broadcast operational guidelines.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-24">
          {/* Press Releases */}
          <section>
            <ScrollReveal animation="fade-up">
              <div className="flex items-center justify-between mb-8 border-b border-[#E5E7EB] pb-4">
                <h2 className="text-2xl font-extrabold text-[#111827]">
                  Official Press Releases
                </h2>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8D6B1B]">
                  Archival Feed
                </span>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mediaData.pressReleases?.map((release: any, i: number) => (
                <ScrollReveal key={release.id} delay={i * 0.08}>
                  <div className="bg-white p-8 sm:p-10 border border-slate-200/80 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold bg-[#D8EADF] text-[#1E4D38] px-3 py-1 rounded-xl shadow-sm uppercase tracking-wider">
                          {release.category}
                        </span>
                        <span className="text-xs font-medium text-[#4B5563]">{release.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#111827] mb-3 leading-snug">
                        {release.title}
                      </h3>
                      <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
                        {release.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <span className="text-xs font-semibold text-[#8D6B1B]">{release.readTime}</span>
                      <button className="text-[#1E4D38] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 hover:text-[#111827] transition-colors">
                        <span>Read Full Release</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Media Kits */}
          <section id="kits">
            <ScrollReveal animation="fade-up">
              <div className="flex items-center justify-between mb-8 border-b border-[#E5E7EB] pb-4">
                <h2 className="text-2xl font-extrabold text-[#111827]">
                  Media Kits &amp; Downloadable Assets
                </h2>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D38]">
                  Digital Assets
                </span>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {mediaData.mediaKits?.map((kit: any, i: number) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="bg-white p-7 border border-slate-200/80 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex items-start space-x-5">
                    <div className="bg-[#FEF3D6] p-4 text-[#8D6B1B] rounded-2xl shadow-sm shrink-0 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-base font-bold text-[#111827] mb-1.5">{kit.title}</h3>
                      <p className="text-xs text-[#4B5563] mb-4 leading-relaxed">
                        {kit.format} · <span className="font-semibold">{kit.fileSize}</span>
                      </p>
                      <button className="text-xs font-bold text-[#1E4D38] inline-flex items-center gap-1.5 bg-[#FBFBFA] border border-[#B8D8C5] px-4 py-2 rounded-xl hover:bg-[#D8EADF] shadow-sm transition-all">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Kit</span>
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Media Guidelines */}
          <section>
            <ScrollReveal animation="fade-up">
              <h2 className="text-2xl font-extrabold text-[#111827] mb-8 border-b border-[#E5E7EB] pb-4">
                Operational Media Guidelines
              </h2>
            </ScrollReveal>
            <div className="bg-white p-8 md:p-12 border border-slate-200/80 rounded-2xl shadow-card">
              <ul className="space-y-5">
                {(mediaData.mediaGuidelines || (mediaData as any).guidelines)?.map((guideline: string, i: number) => (
                  <ScrollReveal key={i} delay={i * 0.05}>
                    <li className="flex items-start">
                      <div className="w-7 h-7 rounded-xl bg-[#FEF3D6] text-[#8D6B1B] flex items-center justify-center shrink-0 mr-3.5 mt-0.5 shadow-sm">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-[#4B5563] leading-relaxed pt-0.5">{guideline}</span>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
