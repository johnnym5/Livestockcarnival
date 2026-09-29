'use client';

import { motion, MotionProps } from 'framer-motion';
import { ReactNode, ElementType } from 'react';
import { dramaticEase } from '@/lib/motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'zoom-out' | 'fade' | 'clip';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  duration?: number;
  once?: boolean;
  amount?: number;
  as?: ElementType;
}

const getVariants = (direction: Direction, distance = 48) => ({
  hidden: {
    opacity: 0,
    ...(direction === 'up' && { y: distance, scale: 0.97 }),
    ...(direction === 'down' && { y: -distance }),
    ...(direction === 'left' && { x: distance, scale: 0.97 }),
    ...(direction === 'right' && { x: -distance, scale: 0.97 }),
    ...(direction === 'zoom' && { scale: 0.82, filter: 'blur(6px)' }),
    ...(direction === 'zoom-out' && { scale: 1.15, filter: 'blur(4px)' }),
    ...(direction === 'fade' && {}),
    ...(direction === 'clip' && { clipPath: 'inset(0 100% 0 0)' }),
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    clipPath: direction === 'clip' ? 'inset(0 0% 0 0)' : undefined,
  },
});

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.9,
  once = true,
  amount = 0.1,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const MotionTag = motion[Tag as keyof typeof motion] as React.ComponentType<MotionProps & { className?: string }>;

  return (
    <MotionTag
      className={className}
      variants={getVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{
        duration,
        ease: dramaticEase,
        delay,
      }}
    >
      {children}
    </MotionTag>
  );
}
