'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface MagazineRowProps {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  images?: string[];
  imageAlt?: string;
  ctaText?: string;
  ctaLink?: string;
  isTextLeft?: boolean;
}

export default function MagazineRow({
  eyebrow,
  title,
  body,
  image,
  images,
  imageAlt,
  ctaText = 'Explore Details',
  ctaLink = '/attractions',
  isTextLeft = true,
}: MagazineRowProps) {
  // Normalize images list
  const imageList = Array.isArray(images) && images.length > 0 ? images : [image];
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-transition between images every 6 seconds if multiple exist
  useEffect(() => {
    if (imageList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % imageList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [imageList.length]);

  return (
    <section className="w-full relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden bg-white border-b border-[#E5E7EB]">
      <div className="w-full max-w-[1536px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
        {/* TEXT COLUMN - Slower, cinematic upward reveal */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className={`z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 bg-white ${
            isTextLeft
              ? 'lg:col-span-6 lg:order-1'
              : 'lg:col-span-6 lg:col-start-7 lg:order-2'
          }`}
        >
          <div className="max-w-xl">
            {/* Unboxed Eyebrow */}
            <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.25em] text-[#8D6B1B] uppercase block mb-4">
              {eyebrow}
            </span>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#111827] leading-[1.15] tracking-tight mb-6">
              {title}
            </h2>

            {/* Body Text */}
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed mb-8">
              {body}
            </p>

            {/* CTA Link */}
            <div>
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase text-[#1E4D38] hover:text-[#111827] group transition-colors"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* IMAGE COLUMN WITH SLOW CROSS-FADE, STAGGERED REVEAL & AMBIENT ZOOM */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`relative min-h-[360px] sm:min-h-[440px] lg:min-h-full overflow-hidden bg-slate-900 ${
            isTextLeft
              ? 'lg:col-span-6 lg:order-2'
              : 'lg:col-span-6 lg:col-start-1 lg:order-1'
          }`}
        >
          {/* Cross-fading layered background slideshow */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={imageList[activeIdx]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <motion.div
                animate={{ scale: [1.0, 1.08] }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
                className="relative w-full h-full"
              >
                <Image
                  src={imageList[activeIdx]}
                  alt={imageAlt || title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={activeIdx === 0}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Slide Switcher Dots */}
          {imageList.length > 1 && (
            <div
              className={`absolute bottom-5 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-lg ${
                isTextLeft ? 'right-6' : 'left-6'
              }`}
            >
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  title={`Switch to photo ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIdx === idx
                      ? 'w-6 bg-[#D4AF37]'
                      : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
              <span className="text-[10px] font-bold text-white/90 ml-1 tracking-wider">
                {activeIdx + 1}/{imageList.length}
              </span>
            </div>
          )}

          {/* Seamless gradient mask fade */}
          <div
            className={`absolute inset-0 pointer-events-none hidden lg:block z-20 ${
              isTextLeft
                ? 'bg-gradient-to-r from-white via-white/50 to-transparent'
                : 'bg-gradient-to-l from-white via-white/50 to-transparent'
            }`}
            style={{
              background: isTextLeft
                ? 'linear-gradient(to right, #FFFFFF 0%, rgba(255, 255, 255, 0.65) 15%, transparent 40%)'
                : 'linear-gradient(to left, #FFFFFF 0%, rgba(255, 255, 255, 0.65) 15%, transparent 40%)',
            }}
          />

          {/* Mobile bottom fade */}
          <div className="absolute inset-0 pointer-events-none lg:hidden z-20 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
        </motion.div>
      </div>
    </section>
  );
}
