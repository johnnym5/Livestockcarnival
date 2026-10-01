export interface HomepageMotionSettings {
  stackStartY: number;
  stackScaleDesktop: number;
  stackScaleMobile: number;
  stackPeek: number;
  fanSpreadDesktop: number;
  fanSpreadMobile: number;
  fanDuration: number;
  riseDuration: number;
  flipDuration: number;
  magazineScale: number;
  magazineBlurDesktop: number;
  magazineBlurMobile: number;
}

export const DEFAULT_HOMEPAGE_MOTION: HomepageMotionSettings = {
  stackStartY: 0.82,
  stackScaleDesktop: 0.66,
  stackScaleMobile: 0.86,
  stackPeek: 0.33,
  fanSpreadDesktop: 68,
  fanSpreadMobile: 54,
  fanDuration: 1.7,
  riseDuration: 0.72,
  flipDuration: 0.72,
  magazineScale: 0.88,
  magazineBlurDesktop: 2,
  magazineBlurMobile: 0.9,
};

const ranges: Record<keyof HomepageMotionSettings, [number, number]> = {
  stackStartY: [0.35, 1.35],
  stackScaleDesktop: [0.3, 0.9],
  stackScaleMobile: [0.4, 1],
  stackPeek: [0.05, 0.42],
  fanSpreadDesktop: [35, 100],
  fanSpreadMobile: [28, 80],
  fanDuration: [0.5, 3.5],
  riseDuration: [0.2, 1.8],
  flipDuration: [0.25, 1.5],
  magazineScale: [0.55, 1],
  magazineBlurDesktop: [0, 8],
  magazineBlurMobile: [0, 2.5],
};

export function normalizeHomepageMotion(value: unknown): HomepageMotionSettings {
  const candidate = (value && typeof value === 'object' ? value : {}) as Partial<Record<keyof HomepageMotionSettings, unknown>>;
  return Object.fromEntries(
    (Object.keys(DEFAULT_HOMEPAGE_MOTION) as (keyof HomepageMotionSettings)[]).map((key) => {
      const fallback = DEFAULT_HOMEPAGE_MOTION[key];
      const raw = Number(candidate[key]);
      const [min, max] = ranges[key];
      return [key, Number.isFinite(raw) ? Math.max(min, Math.min(max, raw)) : fallback];
    })
  ) as unknown as HomepageMotionSettings;
}
