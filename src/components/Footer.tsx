import Link from 'next/link';
import Image from 'next/image';
import { Shield, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white w-full border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            {/* LSC Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/assets/branding/carnival-logo-transparent.png"
                alt="Livestock Carnival Emblem"
                width={56}
                height={42}
                className="shrink-0 object-contain w-12 h-10"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight leading-snug">
                  RENEWED HOPE NATIONAL LIVESTOCK CARNIVAL 2026
                </span>
                <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">
                  GOLDEN CAMEL &amp; COW CARNIVAL
                </span>
              </div>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              Official Federal Government of Nigeria public festival and trade gateway. Uniting pastoral heritage, cultural pageantry, and global agribusiness export wealth.
            </p>
            <div className="flex items-center gap-2 text-gray-300 mt-2 text-xs font-medium">
              <Shield size={14} className="text-[#D4AF37] shrink-0" />
              <span>Federal Republic of Nigeria Staging</span>
            </div>
          </div>

          {/* Festival Hubs */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Festival Hubs</h4>
            <nav className="flex flex-col gap-2.5">
              <Link href="/fashion-parade" className="text-[#D4AF37] hover:text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
                <span>Cultural Fashion Parade</span>
                <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold">EDITORIAL</span>
              </Link>
              <Link href="/attractions#durbar" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Royal Durbar Pageantry
              </Link>
              <Link href="/attractions#suya" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Open-Flame Suya Village
              </Link>
              <Link href="/attractions" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Live Concerts &amp; Ijele Pageantry
              </Link>
              <Link href="/schedule" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Livestock Breed Judging
              </Link>
              <Link href="/schedule#map" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Interactive Venue Map
              </Link>
            </nav>
          </div>

          {/* Policy & Media */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Policy &amp; Media</h4>
            <nav className="flex flex-col gap-2.5">
              <Link href="/about" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Presidential Mandate
              </Link>
              <Link href="/nhesics" className="text-[#D4AF37] hover:text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
                <span>NHESICS Secretariat</span>
                <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold">MANDATE</span>
              </Link>
              <Link href="/about#financing" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Agro-Industrial Financing Window
              </Link>
              <Link href="/media" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Press Releases &amp; Briefings
              </Link>
              <Link href="/media#kits" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Media Kit Downloads
              </Link>
              <Link href="/accreditation" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">
                Journalist Accreditation
              </Link>
            </nav>
          </div>

          {/* External Portals & Venue */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">External Portals &amp; Venue</h4>
            <nav className="flex flex-col gap-2.5 mb-2">
              <a
                href="https://pass.livestockcarnival.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:underline text-sm font-semibold transition-colors"
              >
                Claim Free Gate Pass →
              </a>
              <a
                href="https://vendors.livestockcarnival.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white text-sm font-semibold transition-colors"
              >
                Exhibitor Booths →
              </a>
            </nav>
            <div className="text-xs text-[#9CA3AF] leading-relaxed pt-2 border-t border-white/10 space-y-1">
              <p className="font-semibold text-white">Secretariat Contact</p>
              <a href="tel:+2349014740776" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={12} className="text-[#D4AF37]" /> 09014740776 (Call)
              </a>
              <a href="https://wa.me/2349014740776" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <MessageCircle size={12} className="text-[#25D366]" /> 09014740776 (WhatsApp)
              </a>
              <div className="pt-2">
                <p className="font-semibold text-white">Abuja National Grounds</p>
                <p>Old Parade Ground, Area 10, Garki, Abuja FCT</p>
                <p className="mt-0.5">November 21 – 23, 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#9CA3AF]">
          <div>
            &copy; 2026 Federal Republic of Nigeria · Renewed Hope National Livestock Carnival. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="https://x.com/livestockcarn" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Twitter (X)
            </a>
            <a href="https://instagram.com/livestock_carnival" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Instagram
            </a>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
