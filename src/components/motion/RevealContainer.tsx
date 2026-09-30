'use client';

import { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';

export const EASE_CUSTOM = [0.22, 1, 0.36, 1] as const;

export const containerVariants: Variants = {
  hidden: {},
  visible: (custom?: { stagger?: number; delay?: number }) => ({
    transition: {
      staggerChildren: custom?.stagger ?? 0.35,
      delayChildren: custom?.delay ?? 0,
    },
  }),
};

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 44,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: EASE_CUSTOM,
    },
  },
};

export interface RevealContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  viewportAmount?: number;
}

export function RevealContainer({
  children,
  className = '',
  staggerDelay = 0.35,
  initialDelay = 0,
  viewportAmount = 0.1,
  ...props
}: RevealContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: viewportAmount }}
      custom={{ stagger: staggerDelay, delay: initialDelay }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface RevealItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  customVariants?: Variants;
}

export function RevealItem({
  children,
  className = '',
  customVariants,
  ...props
}: RevealItemProps) {
  return (
    <motion.div
      variants={customVariants || itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
