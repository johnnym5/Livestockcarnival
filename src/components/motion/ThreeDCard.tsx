'use client';

import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useSpring } from 'framer-motion';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'light' | 'glass';
  glowColor?: string;
  maxTilt?: number;
  scaleOnHover?: number;
  depth?: number;
  onClick?: () => void;
}

export default function ThreeDCard({
  children,
  className = '',
  variant = 'glass',
  glowColor = 'rgba(228, 176, 58, 0.25)',
  maxTilt = 10,
  scaleOnHover = 1.025,
  depth = 24,
  onClick,
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  // Spring physics for buttery-smooth 3D rotation
  const springConfig = { stiffness: 350, damping: 26 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const z = useSpring(0, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized coordinates (-1 to 1) from card center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;

    // Rotate inverted on X, direct on Y for natural 3D tilt
    rotateX.set(-yPct * maxTilt);
    rotateY.set(xPct * maxTilt);
    scale.set(scaleOnHover);
    z.set(depth);

    // Update specular glare reflection
    setGlarePosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    z.set(0);
  };

  // Variant base styles
  const variantStyles = {
    glass:
      'bg-slate-900/85 backdrop-blur-xl border border-amber-500/25 text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]',
    dark:
      'bg-[#0D1F15] border border-[#E4B03A]/25 text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]',
    light:
      'bg-white/95 backdrop-blur-xl border border-slate-200/90 text-[#111827] shadow-[0_16px_40px_-10px_rgba(17,24,39,0.08)] hover:shadow-[0_24px_55px_-10px_rgba(30,77,56,0.18)]',
  }[variant];

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          scale,
          z,
          transformStyle: 'preserve-3d',
        }}
        className={`relative rounded-2xl overflow-hidden transition-colors duration-300 ${variantStyles} ${className} ${
          onClick ? 'cursor-pointer' : ''
        }`}
      >
        {/* Dynamic Specular Glass Glare / Sheen */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, ${glowColor}, transparent 70%)`,
          }}
        />

        {/* Ambient Top Rim Highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none z-30" />

        {/* Card Content with 3D Pop Layer */}
        <div className="relative z-10 w-full h-full [transform-style:preserve-3d]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
