'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  animation?: string;
}

const directionMap: Record<string, { x: number; y: number }> = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  'fade-up': { y: 24, x: 0 },
  'fade-down': { y: -24, x: 0 },
  'fade-left': { x: 24, y: 0 },
  'fade-right': { x: -24, y: 0 },
};

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  animation,
}: ScrollRevealProps) {
  const key = animation || direction;
  const offset = directionMap[key] || directionMap.up;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
