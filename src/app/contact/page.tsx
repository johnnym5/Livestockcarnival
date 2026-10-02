import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, ExternalLink, Ticket, Store, Building2, Share2, MessageCircle } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const departments = [
  { name: "Exhibitor Relations", email: "exhibitors@livestockcarnival.ng" },
  { name: "Media & PR", email: "press@livestockcarnival.ng" },
  { name: "Protocol & VIP", email: "protocol@livestockcarnival.ng" },
  { name: "Logistics & Security", email: "logistics@livestockcarnival.ng" },
  { name: "Sponsorship", email: "sponsors@livestockcarnival.ng" },
  { name: "General Enquiries", email: "hello@livestockcarnival.ng" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] overflow-x-hidden">
      {/* Ambient light orbs */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-[#D8EADF]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-40 left-0 w-[400px] h-[400px] bg-[#FEF3D6]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Page Header */}
        <div className="text-center mb-20">
          <ScrollReveal direction="zoom" delay={0}>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#1E4D38] uppercase tracking-[0.22em] mb-5">
              <span className="w-6 h-px bg-[#E4B03A]" />
              Secretariat &amp; Venue Directory
              <span className="w-6 h-px bg-[#E4B03A]" />
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.08} duration={1.1}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-5 leading-tight tracking-tight">
              Get in Touch
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.16} duration={1.0}>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
              Reach the Renewed Hope National Livestock Carnival 2026 organizers or find your way to the Abuja National Grounds.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <div className="w-16 h-0.5 bg-[#E4B03A] mx-auto mt-6" />
          </ScrollReveal>
        </div>

        {/* Contact Info + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24">
          <ScrollReveal direction="right" duration={1.0}>
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Contact Information</h2>

              {[
                {
                  icon: MapPin,
                  bg: 'bg-[#D8EADF]',
                  color: 'text-[#1E4D38]',
                  title: 'Venue Address',
                  content: <p className="text-[#4B5563] leading-relaxed">Old Parade Ground<br />Area 10, Garki<br />Abuja, Federal Capital Territory, Nigeria</p>,
                },
                {
                  icon: Phone,
                  bg: 'bg-[#FEF3D6]',
                  color: 'text-[#8D6B1B]',
                  title: 'Phone Lines & WhatsApp',
                  content: (
                    <div className="space-y-1.5">
                      <a href="tel:+2349014740776" className="flex items-center gap-2 text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm font-medium">
                        <Phone className="w-3.5 h-3.5 text-[#1E4D38]" />
                        09014740776 - Secretariat Phone Line
                      </a>
                      <a href="https://wa.me/2349014740776" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm font-medium">
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        09014740776 - Official WhatsApp Line
                      </a>
                    </div>
                  ),
                },
                {
                  icon: Mail,
                  bg: 'bg-[#D8EADF]',
                  color: 'text-[#1E4D38]',
                  title: 'Email Addresses',
                  content: (
                    <div className="space-y-1">
                      <a href="mailto:info@livestockcarnival.ng" className="block text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm">info@livestockcarnival.ng</a>
                      <a href="mailto:press@livestockcarnival.ng" className="block text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm">press@livestockcarnival.ng</a>
                    </div>
                  ),
                },
                {
                  icon: Share2,
                  bg: 'bg-[#FEF3D6]',
                  color: 'text-[#8D6B1B]',
                  title: 'Social Media Channels',
                  content: (
                    <div className="space-y-1">
                      <a href="https://x.com/livestockcarnival" target="_blank" rel="noopener noreferrer" className="block text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm font-medium">
                        Twitter (X): @livestockcarnival
                      </a>
                      <a href="https://instagram.com/livestockcarnival" target="_blank" rel="noopener noreferrer" className="block text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm font-medium">
                        Instagram: @livestockcarnival
                      </a>
                    </div>
                  ),
                },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-start gap-5 shadow-card card-lift">
                  <div className={`${card.bg} rounded-xl p-3 ${card.color} shrink-0`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#111827] font-semibold mb-2">{card.title}</h3>
                    {card.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" duration={1.0} delay={0.1}>
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card h-full min-h-[420px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.3546747201633!2d7.485121375836261!3d9.031386591029283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b48db92bb21%3A0xc395f2fc44621517!2sOld%20Parade%20Ground!5e0!3m2!1sen!2sng!4v1714571987541!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '420px', display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Online Portals */}
        <section className="mb-20">
          <ScrollReveal direction="up" delay={0}>
            <h2 className="text-2xl font-bold text-[#111827] mb-8">Online Portals &amp; Registration</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal direction="left" delay={0}>
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col justify-between shadow-card card-lift h-full">
                <div>
                  <div className="bg-[#D8EADF] rounded-xl p-3 text-[#1E4D38] w-fit mb-5">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#1E4D38] uppercase tracking-wider block mb-2">Public &amp; Professional Entry</span>
                  <h3 className="text-xl font-bold text-[#111827] mb-3">Claim Free Gate Pass</h3>
                  <p className="text-[#4B5563] text-sm leading-relaxed mb-6">Register for complimentary festival entry, arena access, Durbar pageantry, and fresh meat market.</p>
                </div>
                <a
                  href="https://pass.livestockcarnival.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1E4D38] text-white py-3 px-6 font-semibold rounded-xl shadow-button hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm"
                >
                  Access Ticket Portal
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1}>
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col justify-between shadow-card card-lift h-full">
                <div>
                  <div className="bg-[#FEF3D6] rounded-xl p-3 text-[#8D6B1B] w-fit mb-5">
                    <Store className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#8D6B1B] uppercase tracking-wider block mb-2">Vendors, Exhibitors &amp; Trade</span>
                  <h3 className="text-xl font-bold text-[#111827] mb-3">Vendor &amp; Exhibitor Registration</h3>
                  <p className="text-[#4B5563] text-sm leading-relaxed mb-6">Apply for exhibition stalls, food village booths, livestock display spaces, and commercial trade passes.</p>
                </div>
                <a
                  href="https://vendors.livestockcarnival.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FEF3D6] text-[#8D6B1B] py-3 px-6 font-semibold rounded-xl border border-[#FCE6A8] hover:-translate-y-0.5 hover:bg-[#FCE6A8] transition-all text-sm"
                >
                  Access Vendor Portal
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Secretariat Departments */}
        <section className="mb-20">
          <ScrollReveal direction="up" delay={0}>
            <h2 className="text-2xl font-bold text-[#111827] mb-8">Secretariat Departments</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {departments.map((dept, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.08} duration={0.8}>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card card-lift">
                  <div className="bg-[#D8EADF] rounded-xl p-2.5 text-[#1E4D38] w-fit mb-4">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-[#111827] font-semibold mb-1.5">{dept.name}</h3>
                  <a href={`mailto:${dept.email}`} className="text-sm text-[#1E4D38] hover:underline">{dept.email}</a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Venue Map CTA Banner */}
        <ScrollReveal direction="up" delay={0.05} duration={1.0}>
          <div className="relative bg-[#1E4D38] rounded-2xl text-white p-12 text-center shadow-card overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4">Navigating the Carnival?</h2>
              <p className="text-lg text-[#D8EADF] mb-8 max-w-2xl mx-auto leading-relaxed">
                Explore our interactive venue map to find all attraction zones, food courts, and essential facilities.
              </p>
              <Link
                href="/schedule#map"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E4B03A] text-[#111827] font-bold tracking-wide rounded-xl hover:bg-[#D4A030] transition-all shadow-button hover:-translate-y-0.5"
              >
                Open Interactive Venue Map
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
