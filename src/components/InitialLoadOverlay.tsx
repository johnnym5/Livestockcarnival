'use client';

import { useEffect, useRef, useState } from 'react';
import BrandLoadingContent from '@/components/BrandLoadingContent';

export default function InitialLoadOverlay({
  isHomePage = false,
  duration = 3,
}: {
  isHomePage?: boolean;
  duration?: number;
}) {
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    // If returning to homepage after initial load, reveal scene if previously dismissed
    if (isHomePage && readyRef.current) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('homepage:reveal-start'));
      }
      return;
    }

    let frame = 0;
    let fallbackTimer = 0;
    let observer: MutationObserver | null = null;

    const dismiss = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      if (isHomePage && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('homepage:reveal-start'));
      }
      frame = window.requestAnimationFrame(() => setReady(true));
    };

    if (isHomePage) {
      const watchHomepage = () => {
        const homepage = document.getElementById('home-page');
        if (homepage?.dataset.homeReady === 'true') {
          dismiss();
          observer?.disconnect();
        }
      };

      if (typeof document !== 'undefined') {
        observer = new MutationObserver(watchHomepage);
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-home-ready'],
          subtree: true,
        });
        watchHomepage();
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('homepage:scene-ready', dismiss);
        window.addEventListener('load', dismiss, { once: true });
        // Fail-safe timeout for homepage (1.2s max)
        fallbackTimer = window.setTimeout(dismiss, 1200);
      }
    } else {
      // Non-homepage routes (e.g. /media, /schedule, /about, /livestock):
      // If DOM is already parsed/interactive/complete, dismiss immediately.
      if (typeof document !== 'undefined' && document.readyState !== 'loading') {
        dismiss();
      } else if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', dismiss, { once: true });
        window.addEventListener('load', dismiss, { once: true });
        // Fail-safe timeout (400ms max) to ensure overlay NEVER stays stuck on page reload
        fallbackTimer = window.setTimeout(dismiss, 400);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(fallbackTimer);
        window.removeEventListener('homepage:scene-ready', dismiss);
        window.removeEventListener('DOMContentLoaded', dismiss);
        window.removeEventListener('load', dismiss);
      }
      observer?.disconnect();
    };
  }, [isHomePage]);

  if (ready) return null;

  return (
    <div
      aria-hidden={ready}
      style={isHomePage ? { transitionDuration: `${duration}s` } : undefined}
      className={`fixed inset-0 z-[120] flex items-center justify-center ${
        isHomePage ? 'bg-white' : 'bg-[#111827]'
      } transition-opacity ${
        isHomePage ? '' : 'duration-500'
      } ease-in-out motion-reduce:transition-none ${
        ready ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {!isHomePage && (
        <div className="initial-load-content">
          <BrandLoadingContent />
        </div>
      )}
    </div>
  );
}
