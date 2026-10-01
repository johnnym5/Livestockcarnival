export type TransitionEffect = 'fade' | 'blur-fade' | 'slide-fade';

export interface SiteAnimationValues {
  transitionEffect: TransitionEffect;
  transitionDuration: number;
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

export const DEFAULT_SITE_ANIMATION: SiteAnimationDocument = {
  defaults: {
    transitionEffect: 'blur-fade', transitionDuration: 0.5, homepageRevealDuration: 3,
    scrollDuration: 0.85, scrollRevealDuration: 0.5, skeletonDuration: 1.4,
    skeletonEnabled: true, interactionDuration: 0.2, cardDeckEnabled: true,
  },
  pageOverrides: {},
};

const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
};

function normalizeValues(input: unknown, fallback: SiteAnimationValues): SiteAnimationValues {
  const value = input && typeof input === 'object' ? input as Partial<SiteAnimationValues> : {};
  const effects: TransitionEffect[] = ['fade', 'blur-fade', 'slide-fade'];
  return {
    transitionEffect: effects.includes(value.transitionEffect as TransitionEffect) ? value.transitionEffect as TransitionEffect : fallback.transitionEffect,
    transitionDuration: clamp(value.transitionDuration, fallback.transitionDuration, 0, 3),
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
