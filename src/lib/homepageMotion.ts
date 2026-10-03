export interface HomepageMotionSettings {
  heroRevealPreset: number;
  heroStepStagger: number;
  heroStepDuration: number;
  riseDelay: number;
  sceneLengthVh: number;
  stackStartY: number;
  stackScaleDesktop: number;
  stackScaleMobile: number;
  fanScaleDesktop: number;
  fanScaleMobile: number;
  stackPeek: number;
  fanSpreadDesktop: number;
  fanSpreadMobile: number;
  riseDuration: number;
  flipDuration: number;
  heroScaleOpeningDesktop: number;
  heroScaleOpeningMobile: number;
  heroScaleCoveredDesktop: number;
  heroScaleCoveredMobile: number;
  heroBlur: number;
  heroBackgroundIntensity: number;
  cardFocusScaleDesktop: number;
  cardFocusScaleMobile: number;
  cardFocusLiftDesktop: number;
  cardFocusLiftMobile: number;
  cardFocusBlur: number;
  heroShrinkEnd: number;
  cardScrollStart: number;
  fanStartProgress: number;
  fanEndProgress: number;
  promptStartProgress: number;
  promptEndProgress: number;
  fanHoldEndProgress: number;
  magazineEndProgress: number;
  magazineRestackAt: number;
  magazineScale: number;
  magazineBlurDesktop: number;
  magazineBlurMobile: number;
  cardFlipDuration: number;
  cardReturnDuration: number;
}

export const DEFAULT_HOMEPAGE_MOTION: HomepageMotionSettings = {
  heroRevealPreset: 0,
  heroStepStagger: 0.16,
  heroStepDuration: 0.65,
  riseDelay: 0.9,
  sceneLengthVh: 390,
  stackStartY: 0.41,
  stackScaleDesktop: 1.05,
  stackScaleMobile: 0.98,
  fanScaleDesktop: 1,
  fanScaleMobile: 0.88,
  stackPeek: 0.3,
  fanSpreadDesktop: 68,
  fanSpreadMobile: 46,
  riseDuration: 1.1,
  flipDuration: 1.15,
  heroScaleOpeningDesktop: 1,
  heroScaleOpeningMobile: 1,
  heroScaleCoveredDesktop: 0.75,
  heroScaleCoveredMobile: 0.75,
  heroBlur: 2,
  heroBackgroundIntensity: 5,
  cardFocusScaleDesktop: 1.1,
  cardFocusScaleMobile: 1.06,
  cardFocusLiftDesktop: 24,
  cardFocusLiftMobile: 14,
  cardFocusBlur: 2.5,
  heroShrinkEnd: 0.28,
  cardScrollStart: 0.08,
  fanStartProgress: 0.15,
  fanEndProgress: 0.42,
  promptStartProgress: 0.42,
  promptEndProgress: 0.48,
  fanHoldEndProgress: 0.56,
  magazineEndProgress: 0.94,
  magazineRestackAt: 0.9,
  magazineScale: 0.75,
  magazineBlurDesktop: 2,
  magazineBlurMobile: 0.7,
  cardFlipDuration: 0.48,
  cardReturnDuration: 0.36,
};

const ranges: Record<keyof HomepageMotionSettings, [number, number]> = {
  heroRevealPreset: [0, 3],
  heroStepStagger: [0.04, 0.5],
  heroStepDuration: [0.15, 1.5],
  riseDelay: [0, 2.5],
  sceneLengthVh: [280, 600],
  stackStartY: [0.3, 0.8],
  stackScaleDesktop: [0.65, 1.2],
  stackScaleMobile: [0.55, 1.1],
  fanScaleDesktop: [0.55, 1.25],
  fanScaleMobile: [0.5, 1.1],
  stackPeek: [0.08, 0.55],
  fanSpreadDesktop: [35, 100],
  fanSpreadMobile: [24, 72],
  riseDuration: [0.25, 3],
  flipDuration: [0.4, 2.5],
  heroScaleOpeningDesktop: [0.75, 1],
  heroScaleOpeningMobile: [0.75, 1],
  heroScaleCoveredDesktop: [0.5, 1.1],
  heroScaleCoveredMobile: [0.5, 1.1],
  heroBlur: [0, 10],
  heroBackgroundIntensity: [0, 10],
  cardFocusScaleDesktop: [1, 1.2],
  cardFocusScaleMobile: [1, 1.15],
  cardFocusLiftDesktop: [8, 64],
  cardFocusLiftMobile: [4, 36],
  cardFocusBlur: [0, 10],
  heroShrinkEnd: [0.08, 0.48],
  cardScrollStart: [0.01, 0.45],
  fanStartProgress: [0.02, 0.55],
  fanEndProgress: [0.08, 0.72],
  promptStartProgress: [0.08, 0.84],
  promptEndProgress: [0.1, 0.9],
  fanHoldEndProgress: [0.12, 0.86],
  magazineEndProgress: [0.2, 1],
  magazineRestackAt: [0.9, 0.98],
  magazineScale: [0.55, 1],
  magazineBlurDesktop: [0, 8],
  magazineBlurMobile: [0, 2.5],
  cardFlipDuration: [0.18, 1],
  cardReturnDuration: [0.15, 0.8],
};

const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
};

export function normalizeHomepageMotion(value: unknown): HomepageMotionSettings {
  const candidate = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  // Map settings shared with the retired carousel, while resetting its old
  // geometry values that would move the redesigned deck off-screen.
  const source: Record<string, unknown> = {
    ...candidate,
    fanScaleDesktop: candidate.fanScaleDesktop ?? DEFAULT_HOMEPAGE_MOTION.fanScaleDesktop,
    fanScaleMobile: candidate.fanScaleMobile ?? DEFAULT_HOMEPAGE_MOTION.fanScaleMobile,
    heroScaleOpeningDesktop: candidate.heroScaleOpeningDesktop ?? DEFAULT_HOMEPAGE_MOTION.heroScaleOpeningDesktop,
    heroScaleOpeningMobile: candidate.heroScaleOpeningMobile ?? DEFAULT_HOMEPAGE_MOTION.heroScaleOpeningMobile,
    heroScaleCoveredDesktop: candidate.heroScaleCoveredDesktop ?? candidate.heroScale ?? DEFAULT_HOMEPAGE_MOTION.heroScaleCoveredDesktop,
    heroScaleCoveredMobile: candidate.heroScaleCoveredMobile ?? candidate.heroScale ?? DEFAULT_HOMEPAGE_MOTION.heroScaleCoveredMobile,
    ...(Number.isFinite(Number(candidate.sceneLengthVh)) ? {} : {
        stackStartY: DEFAULT_HOMEPAGE_MOTION.stackStartY,
        stackScaleDesktop: DEFAULT_HOMEPAGE_MOTION.stackScaleDesktop,
        stackScaleMobile: DEFAULT_HOMEPAGE_MOTION.stackScaleMobile,
        heroScaleOpeningDesktop: DEFAULT_HOMEPAGE_MOTION.heroScaleOpeningDesktop,
        heroScaleOpeningMobile: DEFAULT_HOMEPAGE_MOTION.heroScaleOpeningMobile,
        heroScaleCoveredDesktop: Number(candidate.heroScale ?? DEFAULT_HOMEPAGE_MOTION.heroScaleCoveredDesktop),
        heroScaleCoveredMobile: Number(candidate.heroScale ?? DEFAULT_HOMEPAGE_MOTION.heroScaleCoveredMobile),
        fanScaleDesktop: DEFAULT_HOMEPAGE_MOTION.fanScaleDesktop,
        fanScaleMobile: DEFAULT_HOMEPAGE_MOTION.fanScaleMobile,
        heroShrinkEnd: DEFAULT_HOMEPAGE_MOTION.heroShrinkEnd,
        cardScrollStart: DEFAULT_HOMEPAGE_MOTION.cardScrollStart,
        fanStartProgress: DEFAULT_HOMEPAGE_MOTION.fanStartProgress,
        fanEndProgress: DEFAULT_HOMEPAGE_MOTION.fanEndProgress,
        promptStartProgress: DEFAULT_HOMEPAGE_MOTION.promptStartProgress,
        promptEndProgress: DEFAULT_HOMEPAGE_MOTION.promptEndProgress,
        fanHoldEndProgress: DEFAULT_HOMEPAGE_MOTION.fanHoldEndProgress,
        magazineEndProgress: DEFAULT_HOMEPAGE_MOTION.magazineEndProgress,
        magazineRestackAt: DEFAULT_HOMEPAGE_MOTION.magazineRestackAt,
      }),
  };
  const normalized = Object.fromEntries(
    (Object.keys(DEFAULT_HOMEPAGE_MOTION) as (keyof HomepageMotionSettings)[]).map((key) => {
      const fallback = DEFAULT_HOMEPAGE_MOTION[key];
      const [min, max] = ranges[key];
      return [key, clamp(source[key], fallback, min, max)];
    })
  ) as unknown as HomepageMotionSettings;

  // Keep the scroll points ordered when an editor moves a stage boundary.
  normalized.fanEndProgress = Math.max(normalized.fanStartProgress + 0.04, normalized.fanEndProgress);
  normalized.heroShrinkEnd = Math.max(normalized.cardScrollStart + 0.04, normalized.heroShrinkEnd);
  normalized.fanHoldEndProgress = Math.max(normalized.fanEndProgress + 0.02, normalized.fanHoldEndProgress);
  normalized.promptStartProgress = Math.max(normalized.fanEndProgress, Math.min(normalized.promptStartProgress, normalized.fanHoldEndProgress - 0.04));
  normalized.promptEndProgress = Math.max(normalized.promptStartProgress + 0.02, Math.min(normalized.promptEndProgress, normalized.fanHoldEndProgress));
  normalized.magazineEndProgress = Math.max(normalized.fanHoldEndProgress + 0.04, normalized.magazineEndProgress);

  return normalized;
}
