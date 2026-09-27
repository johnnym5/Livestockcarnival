import { Variants, Transition } from 'framer-motion';

// Easing Curves & Damped Spring Physics
export const editorialEase = [0.16, 1, 0.3, 1] as const;
export const smoothDecel = [0.22, 1, 0.36, 1] as const;

export const softSpring: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 26,
};

export const bounceSpring: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 22,
};

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 28,
};

// Reusable Variants Library

export const fadeInScale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: editorialEase,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: smoothDecel,
    },
  },
};

export const slidePanelRight: Variants = {
  initial: {
    x: '100%',
    opacity: 0,
  },
  animate: {
    x: '0%',
    opacity: 1,
    transition: softSpring,
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.35,
      ease: smoothDecel,
    },
  },
};

export const slideDownDrawer: Variants = {
  initial: {
    y: '-100%',
    opacity: 0,
  },
  animate: {
    y: '0%',
    opacity: 1,
    transition: softSpring,
  },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: smoothDecel,
    },
  },
};

export const accordionExpand: Variants = {
  initial: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: softSpring,
      opacity: { duration: 0.3, ease: editorialEase },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: smoothDecel },
      opacity: { duration: 0.2 },
    },
  },
};

export const staggerParent: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const staggerChildItem: Variants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: editorialEase,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: smoothDecel,
    },
  },
};

export const backdropBlurFade: Variants = {
  initial: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(12px)',
    transition: {
      duration: 0.4,
      ease: editorialEase,
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: smoothDecel,
    },
  },
};
