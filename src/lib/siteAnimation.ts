import type { TargetAndTransition } from 'framer-motion';

export type TransitionEffect =
  | 'fade'
  | 'blur-fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'zoom-blur';

export type TransitionDirection = 'in' | 'out';

export interface SiteAnimationValues {
  transitionInEffect: TransitionEffect;
  transitionOutEffect: TransitionEffect;
  transitionInDuration: number;
  transitionOutDuration: number;
  transitionInBlur: number;
  transitionOutBlur: number;
  transitionInScale: number;
  transitionOutScale: number;
  transitionInDistance: number;
  transitionOutDistance: number;
  homepageRevealDuration: number;
  scrollDuration: number;
  scrollRevealDuration: number;
  skeletonDuration: number;
  skeletonEnabled: boolean;
  interactionDuration: number;
  cardDeckEnabled: boolean;
}

export interface SiteAnimationDocument {
  defaults: SiteAnimationValues;
  pageOverrides: Record<string, Partial<SiteAnimationValues>>;
}

export const SITE_ANIMATION_STORAGE_KEY = 'livestockcarnival:site-animation-settings';
export const SITE_ANIMATION_UPDATED_EVENT = 'livestockcarnival:site-animation-settings-updated';

export const DEFAULT_SITE_ANIMATION: SiteAnimationDocument = {
  defaults: {
    transitionInEffect: 'blur-fade', transitionOutEffect: 'fade',
    transitionInDuration: 0.42, transitionOutDuration: 0.28,
    transitionInBlur: 10, transitionOutBlur: 4,
    transitionInScale: 0.96, transitionOutScale: 1.03,
    transitionInDistance: 28, transitionOutDistance: 18,
    homepageRevealDuration: 3, scrollDuration: 0.85, scrollRevealDuration: 0.5,
    skeletonDuration: 1.4, skeletonEnabled: true, interactionDuration: 0.2,
    cardDeckEnabled: true,
  },
  pageOverrides: {},
};

const effects: TransitionEffect[] = ['fade', 'blur-fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'zoom-in', 'zoom-out', 'zoom-blur'];
const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
};

function normalizeValues(input: unknown, fallback: SiteAnimationValues): SiteAnimationValues {
  const value = input && typeof input === 'object' ? input as Partial<SiteAnimationValues> & { transitionEffect?: unknown; transitionDuration?: unknown } : {};
  const legacyEffect = value.transitionEffect === 'slide-fade'
    ? 'slide-left'
    : effects.includes(value.transitionEffect as TransitionEffect) ? value.transitionEffect as TransitionEffect : undefined;
  const legacyDuration = clamp(value.transitionDuration, fallback.transitionInDuration, 0, 3);
  return {
    transitionInEffect: effects.includes(value.transitionInEffect as TransitionEffect) ? value.transitionInEffect as TransitionEffect : legacyEffect ?? fallback.transitionInEffect,
    transitionOutEffect: effects.includes(value.transitionOutEffect as TransitionEffect) ? value.transitionOutEffect as TransitionEffect : legacyEffect ?? fallback.transitionOutEffect,
    transitionInDuration: clamp(value.transitionInDuration, value.transitionDuration === undefined ? fallback.transitionInDuration : legacyDuration, 0, 3),
    transitionOutDuration: clamp(value.transitionOutDuration, value.transitionDuration === undefined ? fallback.transitionOutDuration : legacyDuration, 0, 3),
    transitionInBlur: clamp(value.transitionInBlur, fallback.transitionInBlur, 0, 32),
    transitionOutBlur: clamp(value.transitionOutBlur, fallback.transitionOutBlur, 0, 32),
    transitionInScale: clamp(value.transitionInScale, fallback.transitionInScale, 0.7, 1.3),
    transitionOutScale: clamp(value.transitionOutScale, fallback.transitionOutScale, 0.7, 1.3),
    transitionInDistance: clamp(value.transitionInDistance, fallback.transitionInDistance, 0, 160),
    transitionOutDistance: clamp(value.transitionOutDistance, fallback.transitionOutDistance, 0, 160),
    homepageRevealDuration: clamp(value.homepageRevealDuration, fallback.homepageRevealDuration, 0, 8),
    scrollDuration: clamp(value.scrollDuration, fallback.scrollDuration, 0.2, 2.5),
    scrollRevealDuration: clamp(value.scrollRevealDuration, fallback.scrollRevealDuration, 0, 2),
    skeletonDuration: clamp(value.skeletonDuration, fallback.skeletonDuration, 0.4, 4),
    skeletonEnabled: typeof value.skeletonEnabled === 'boolean' ? value.skeletonEnabled : fallback.skeletonEnabled,
    interactionDuration: clamp(value.interactionDuration, fallback.interactionDuration, 0, 1),
    cardDeckEnabled: typeof value.cardDeckEnabled === 'boolean' ? value.cardDeckEnabled : fallback.cardDeckEnabled,
  };
}

export function normalizeSiteAnimation(input: unknown): SiteAnimationDocument {
  const source = input && typeof input === 'object' ? input as Partial<SiteAnimationDocument> : {};
  const defaults = normalizeValues(source.defaults, DEFAULT_SITE_ANIMATION.defaults);
  const pageOverrides: Record<string, Partial<SiteAnimationValues>> = {};
  for (const [route, values] of Object.entries(source.pageOverrides ?? {})) {
    const normalized = normalizeValues(values, defaults);
    pageOverrides[route] = Object.fromEntries(Object.keys(values ?? {}).map((key) => [key, normalized[key as keyof SiteAnimationValues]])) as Partial<SiteAnimationValues>;
  }
  return { defaults, pageOverrides };
}

export function resolveSiteAnimation(document: SiteAnimationDocument, route: string): SiteAnimationValues {
  return { ...document.defaults, ...(document.pageOverrides[route] ?? {}) };
}

export function getTransitionFrame(
  effect: TransitionEffect,
  direction: TransitionDirection,
  settings: Pick<SiteAnimationValues, 'transitionInBlur' | 'transitionOutBlur' | 'transitionInScale' | 'transitionOutScale' | 'transitionInDistance' | 'transitionOutDistance'>,
): TargetAndTransition {
  const entering = direction === 'in';
  const blur = entering ? settings.transitionInBlur : settings.transitionOutBlur;
  const scale = entering ? settings.transitionInScale : settings.transitionOutScale;
  const distance = entering ? settings.transitionInDistance : settings.transitionOutDistance;
  const frame: TargetAndTransition = { opacity: 0, filter: 'blur(0px)', x: 0, y: 0, scale: 1 };
  if (effect === 'fade') return frame;
  if (effect === 'blur-fade') frame.filter = `blur(${blur}px)`;
  if (effect === 'slide-up') frame.y = entering ? distance : -distance;
  if (effect === 'slide-down') frame.y = entering ? -distance : distance;
  if (effect === 'slide-left') frame.x = entering ? distance : -distance;
  if (effect === 'slide-right') frame.x = entering ? -distance : distance;
  if (effect === 'zoom-in') frame.scale = entering ? scale : settings.transitionOutScale;
  if (effect === 'zoom-out') frame.scale = entering ? 2 - settings.transitionInScale : 2 - settings.transitionOutScale;
  if (effect === 'zoom-blur') {
    frame.scale = entering ? settings.transitionInScale : settings.transitionOutScale;
    frame.filter = `blur(${blur}px)`;
  }
  return frame;
}

