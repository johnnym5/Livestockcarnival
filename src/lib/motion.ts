import { Variants, Transition } from 'framer-motion';

// ── Premium Easing Curves ──────────────────────────────────────────────────
export const editorialEase = [0.16, 1, 0.3, 1] as const;
export const smoothDecel = [0.22, 1, 0.36, 1] as const;
export const cinematicEase = [0.25, 0.46, 0.45, 0.94] as const;
export const dramaticEase = [0.19, 1, 0.22, 1] as const;

// ── Spring Physics ─────────────────────────────────────────────────────────
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

export const luxurySpring: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 1.2,
};

// ── Core Variants ──────────────────────────────────────────────────────────

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: editorialEase },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: { duration: 0.3, ease: smoothDecel },
  },
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 48, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: dramaticEase },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: smoothDecel },
  },
};

export const fadeDown: Variants = {
  initial: { opacity: 0, y: -48 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: dramaticEase },
  },
};

export const fadeLeft: Variants = {
  initial: { opacity: 0, x: 64, scale: 0.97 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.85, ease: dramaticEase },
  },
};

export const fadeRight: Variants = {
  initial: { opacity: 0, x: -64, scale: 0.97 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.85, ease: dramaticEase },
  },
};

export const zoomIn: Variants = {
  initial: { opacity: 0, scale: 0.82, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.0, ease: dramaticEase },
  },
};

export const zoomOut: Variants = {
  initial: { opacity: 0, scale: 1.15, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.0, ease: cinematicEase },
  },
};

export const clipReveal: Variants = {
  initial: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  animate: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 1.1, ease: dramaticEase },
  },
};

export const slideRevealUp: Variants = {
  initial: { y: '110%', opacity: 0 },
  animate: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.85, ease: dramaticEase },
  },
};

// ── Stagger Systems ────────────────────────────────────────────────────────

export const staggerParent: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const staggerParentFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.0,
    },
  },
};

export const staggerParentSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

export const staggerChildItem: Variants = {
  initial: { opacity: 0, y: 28, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: dramaticEase },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.3, ease: smoothDecel },
  },
};

export const staggerChildFadeLeft: Variants = {
  initial: { opacity: 0, x: 40, scale: 0.97 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.75, ease: dramaticEase },
  },
};

export const staggerChildFadeRight: Variants = {
  initial: { opacity: 0, x: -40, scale: 0.97 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.75, ease: dramaticEase },
  },
};

// ── UI Panel Variants ──────────────────────────────────────────────────────

export const slidePanelRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: '0%', opacity: 1, transition: softSpring },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.35, ease: smoothDecel } },
};

export const slideDownDrawer: Variants = {
  initial: { y: '-100%', opacity: 0 },
  animate: { y: '0%', opacity: 1, transition: softSpring },
  exit: { y: '-100%', opacity: 0, transition: { duration: 0.3, ease: smoothDecel } },
};

export const accordionExpand: Variants = {
  initial: { height: 0, opacity: 0, overflow: 'hidden' },
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

export const backdropBlurFade: Variants = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(12px)',
    transition: { duration: 0.4, ease: editorialEase },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.3, ease: smoothDecel },
  },
};

// ── Hero / Editorial Cinematic ─────────────────────────────────────────────

export const heroHeadline: Variants = {
  initial: { opacity: 0, y: 60, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, ease: dramaticEase },
  },
};

export const heroSubtitle: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: dramaticEase, delay: 0.2 },
  },
};

export const heroEyebrow: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: dramaticEase },
  },
};

// ── Decorative / Ambient ───────────────────────────────────────────────────

export const floatAmbient: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

export const pulseGlow: Variants = {
  initial: { opacity: 0.6, scale: 1 },
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.04, 1],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};
