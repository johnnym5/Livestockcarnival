'use client';

import { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';

export const EASE_CUSTOM = [0.16, 1, 0.3, 1] as const;

export const containerVariants: Variants = {
  hidden: {},
  visible: (custom?: { stagger?: number; delay?: number }) => ({
    transition: {
      staggerChildren: custom?.stagger ?? 0.2,
      delayChildren: custom?.delay ?? 0,
    },
  }),
};

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
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
  staggerDelay = 0.2,
  initialDelay = 0,
  viewportAmount = 0.01,
  ...props
}: RevealContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
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
