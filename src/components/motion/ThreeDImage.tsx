'use client';

import React, { useRef, useState, MouseEvent } from 'react';
import Image from 'next/image';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

interface ThreeDImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  badge?: string;
  priority?: boolean;
  glowColor?: string;
}

export default function ThreeDImage({
  src,
  alt,
  fill = true,
  width,
  height,
  className = '',
  containerClassName = '',
  badge,
  priority = false,
  glowColor = 'rgba(228, 176, 58, 0.3)',
}: ThreeDImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareBackground = useMotionTemplate`radial-gradient(circle 280px at ${glareX}% ${glareY}%, ${glowColor}, transparent 70%)`;

  const springConfig = { stiffness: 240, damping: 30, mass: 0.7 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (prefersReducedMotion || (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches)) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    rotateX.set(-yPct * 8);
    rotateY.set(xPct * 8);
    scale.set(1.02);

    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const handleMouseEnter = () => {
    if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;
    setIsHovered(true);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className={`relative ${containerClassName}`}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-amber-500/20 group cursor-pointer"
      >
        {/* Specular glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            opacity: isHovered ? 1 : 0,
            background: glareBackground,
          }}
        />

        {/* Ambient Top Rim Highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none z-20" />

        {/* Floating Badge (Z-depth 30px) */}
        {badge && (
          <div
            style={{ transform: 'translateZ(30px)' }}
            className="absolute top-3 left-3 z-30 px-3 py-1 rounded-full bg-[#0A1A10]/80 backdrop-blur-md border border-[#E4B03A]/40 text-[#E4B03A] text-[10px] font-extrabold uppercase tracking-wider shadow-lg"
          >
            {badge}
          </div>
        )}

        {/* Main Image with Zoom on Hover */}
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className={`object-cover object-center transition-transform duration-700 group-hover:scale-108 ${className}`}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            className={`object-cover object-center transition-transform duration-700 group-hover:scale-108 ${className}`}
          />
        )}

        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
      </motion.div>
    </div>
  );
}
