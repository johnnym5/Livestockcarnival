'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideDownDrawer, backdropBlurFade } from '@/lib/motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const keepHomeHeaderFull = pathname === '/' && window.matchMedia('(max-width: 767px)').matches;
      setIsScrolled(!keepHomeHeaderFull && window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'NHESICS', href: '/nhesics' },
    { name: 'Fashion Parade', href: '/fashion-parade' },
    { name: 'Attractions', href: '/attractions' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Livestock', href: '/livestock' },
    { name: 'Media', href: '/media' },
    { name: 'Venue Map', href: '/venue-map' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="w-full flex flex-col z-[100] fixed top-0 left-0 right-0">

      {/* ── Main Navigation Bar (90% opaque white background with backdrop blur) ── */}
      <div
        className={`w-full bg-white/95 backdrop-blur-lg border-b border-[#E5E7EB] transition-all duration-300 ${
          isScrolled ? 'shadow-md py-2' : 'py-2.5 sm:py-3'
        }`}
      >
        <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 lg:gap-4">

          {/* ── App Logo: Responsive & Constrained to prevent pushing hamburger offscreen ── */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 shrink flex-1 sm:flex-none">
            <Image
              src="/assets/branding/carnival-logo-transparent.png"
              alt="Livestock Carnival Official Logo"
              width={56}
              height={42}
              className="shrink-0 object-contain w-auto h-7 sm:h-8 lg:h-9 transition-transform group-hover:scale-105"
              priority
            />
            <div className="flex flex-col leading-tight pr-1 min-w-0 overflow-hidden">
              <span className="font-extrabold text-[#111827] text-[9.5px] xs:text-[10.5px] sm:text-xs lg:text-xs xl:text-sm tracking-tight leading-tight group-hover:text-[#1E4D38] transition-colors truncate sm:whitespace-nowrap max-w-[180px] xs:max-w-[240px] sm:max-w-none">
                RENEWED HOPE NATIONAL LIVESTOCK CARNIVAL 2026
              </span>
              <span className="text-[#8D6B1B] text-[7px] xs:text-[8px] sm:text-[9px] lg:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.16em] uppercase truncate sm:whitespace-nowrap max-w-[180px] xs:max-w-[240px] sm:max-w-none">
                GOLDEN CAMEL &amp; COW CARNIVAL
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links (Visible on 2XL / 1400px+) ── */}
          <nav className="hidden 2xl:flex items-center gap-4 2xl:gap-5 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] font-semibold uppercase tracking-wider transition-colors hover:text-[#1E4D38] whitespace-nowrap ${
                  pathname === link.href
                    ? 'text-[#1E4D38] border-b-2 border-[#1E4D38] pb-0.5 font-bold'
                    : 'text-[#4B5563]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTAs ── */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0">
            <a
              href="https://vendors.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#1E4D38] border border-[#B8D8C5] hover:border-[#1E4D38] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl hover:bg-[#D8EADF]/40 transition-all whitespace-nowrap"
            >
              Exhibitor Booths
            </a>
            <a
              href="https://pass.livestockcarnival.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D4AF37] hover:bg-[#C49F27] text-[#111827] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all shadow-button hover:shadow-lg whitespace-nowrap"
            >
              Claim Free Gate Pass
            </a>
          </div>

          {/* ── Mobile & Tablet Hamburger Toggle (Pushed right, shrink-0, z-30) ── */}
          <button
            className={`${pathname === '/schedule' ? '!flex' : '2xl:hidden'} text-[#111827] p-2 focus:outline-none shrink-0 z-30 bg-slate-100 hover:bg-[#D8EADF]/50 rounded-xl border border-slate-200 active:scale-95 transition-all ml-auto`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} className="text-[#1E4D38]" /> : <Menu size={22} className="text-[#111827]" />}
          </button>
        </div>
      </div>

      {/* ── Mobile & Tablet Navigation Drawer (90% opaque white background) ── */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            variants={backdropBlurFade}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`${pathname === '/schedule' ? 'flex' : '2xl:hidden'} w-full bg-white/95 backdrop-blur-lg shadow-2xl border-b border-[#E5E7EB] flex-col p-6 max-h-[calc(100vh-80px)] overflow-y-auto`}
          >
            <motion.nav
              variants={slideDownDrawer}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-3 mb-6"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold uppercase tracking-wider py-2.5 border-b border-slate-100 ${
                    pathname === link.href ? 'text-[#1E4D38] font-bold' : 'text-[#111827] hover:text-[#1E4D38]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </motion.nav>
            <div className="flex flex-col gap-3 pt-2 sm:hidden">
              <a
                href="https://vendors.livestockcarnival.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs font-bold uppercase tracking-wider text-[#1E4D38] border border-[#B8D8C5] py-3 rounded-xl hover:bg-[#D8EADF]/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Exhibitor Booths
              </a>
              <a
                href="https://pass.livestockcarnival.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center bg-[#D4AF37] hover:bg-[#C49F27] text-[#111827] py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Claim Free Gate Pass
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
