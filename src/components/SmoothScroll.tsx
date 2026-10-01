'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({
  children,
  enabled = true,
  duration = 0.85,
}: {
  children: ReactNode;
  enabled?: boolean;
  duration?: number;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPowerDevice = typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    if (!enabled || !isFinePointer || prefersReducedMotion || lowPowerDevice) return;

    // Disable native browser scroll restoration so page always starts at top
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__lenisInstance = lenis;

    // Force scroll reset to top
    lenis.scrollTo(0, { immediate: true });

    let animationFrameId = 0;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__lenisInstance;
      lenis.destroy();
    };
  }, [enabled, duration]);

  return <>{children}</>;
}
