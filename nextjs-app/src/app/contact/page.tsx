import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, ExternalLink, Ticket, Store, Building2 } from "lucide-react";
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
    <div className="min-h-screen bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Page Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="inline-block text-xs font-bold text-[#1E4D38] uppercase tracking-[0.18em] mb-4">
              Secretariat & Venue Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
              Reach the Renewed Hope National Livestock Carnival 2026 organizers or find your way to the Abuja National Grounds.
            </p>
          </div>
        </ScrollReveal>

        {/* Contact Info + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24">

          {/* Contact Cards */}
          <ScrollReveal animation="fade-right">
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Contact Information</h2>

              {/* Venue Address */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-start gap-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="bg-[#D8EADF] rounded-xl p-3 text-[#1E4D38] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[#111827] font-semibold mb-2">Venue Address</h3>
                  <p className="text-[#4B5563] leading-relaxed">
                    Old Parade Ground<br />Area 10, Garki<br />Abuja, Federal Capital Territory, Nigeria
                  </p>
                </div>
              </div>

              {/* Phone Lines */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-start gap-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="bg-[#FEF3D6] rounded-xl p-3 text-[#8D6B1B] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[#111827] font-semibold mb-2">Phone Lines</h3>
                  <div className="space-y-1">
                    <a href="tel:+2348000000000" className="block text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm">
                      +234 800 000 0000 - General Enquiries
                    </a>
                    <a href="tel:+2348000000001" className="block text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm">
                      +234 800 000 0001 - Exhibitor Hotline
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-start gap-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="bg-[#D8EADF] rounded-xl p-3 text-[#1E4D38] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[#111827] font-semibold mb-2">Email Addresses</h3>
                  <div className="space-y-1">
                    <a href="mailto:info@livestockcarnival.ng" className="block text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm">
                      info@livestockcarnival.ng
                    </a>
                    <a href="mailto:press@livestockcarnival.ng" className="block text-[#4B5563] hover:text-[#1E4D38] transition-colors text-sm">
                      press@livestockcarnival.ng
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Map */}
          <ScrollReveal animation="fade-left">
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card h-full min-h-[420px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.3546747201633!2d7.485121375836261!3d9.031386591029283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b48db92bb21%3A0xc395f2fc44621517!2sOld%20Parade%20Ground!5e0!3m2!1sen!2sng!4v1714571987541!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "420px", display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Online Portals */}
        <ScrollReveal animation="fade-up">
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-[#111827] mb-8">
              Online Portals & Registration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Gate Pass Portal */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col justify-between shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300">
                <div>
                  <div className="bg-[#D8EADF] rounded-xl p-3 text-[#1E4D38] w-fit mb-5">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#1E4D38] uppercase tracking-wider block mb-2">
                    Public & Professional Entry
                  </span>
                  <h3 className="text-xl font-bold text-[#111827] mb-3">Claim Free Gate Pass</h3>
                  <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                    Register for complimentary festival entry, arena access, Durbar pageantry, and fresh meat market.
                  </p>
                </div>
                <a
                  href="https://gcc-carnival.web.app/ticket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1E4D38] text-white text-center py-3 px-6 font-semibold rounded-xl shadow-button hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 text-sm"
                >
                  Access Ticket Portal
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Vendor Portal */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col justify-between shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300">
                <div>
                  <div className="bg-[#FEF3D6] rounded-xl p-3 text-[#8D6B1B] w-fit mb-5">
                    <Store className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#8D6B1B] uppercase tracking-wider block mb-2">
                    Vendors, Exhibitors & Trade
                  </span>
                  <h3 className="text-xl font-bold text-[#111827] mb-3">Vendor & Exhibitor Registration</h3>
                  <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                    Apply for exhibition stalls, food village booths, livestock display spaces, and commercial trade passes.
                  </p>
                </div>
                <a
                  href="https://nlf-vendors.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FEF3D6] text-[#8D6B1B] text-center py-3 px-6 font-semibold rounded-xl border border-[#FCE6A8] hover:-translate-y-0.5 hover:bg-[#FCE6A8] transition-all duration-200 text-sm"
                >
                  Access Vendor Portal
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Secretariat Departments */}
        <ScrollReveal animation="fade-up">
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-[#111827] mb-8">
              Secretariat Departments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {departments.map((dept, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="bg-[#D8EADF] rounded-xl p-2.5 text-[#1E4D38] w-fit mb-4">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-[#111827] font-semibold mb-1.5">{dept.name}</h3>
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-sm text-[#1E4D38] hover:underline"
                  >
                    {dept.email}
                  </a>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Venue Map CTA Banner */}
        <ScrollReveal animation="fade-up">
          <div className="bg-[#1E4D38] rounded-2xl text-white p-12 text-center shadow-card">
            <h2 className="text-3xl font-bold mb-4">Navigating the Carnival?</h2>
            <p className="text-lg text-[#D8EADF] mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore our interactive venue map to find all attraction zones, food courts, and essential facilities.
            </p>
            <Link
              href="/venue-map"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FEF3D6] text-[#8D6B1B] font-bold tracking-wide rounded-xl hover:bg-white transition-colors shadow-button"
            >
              Open Interactive Venue Map
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
