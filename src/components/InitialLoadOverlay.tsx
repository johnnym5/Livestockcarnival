'use client';

import { useEffect, useRef, useState } from 'react';
import BrandLoadingContent from '@/components/BrandLoadingContent';

export default function InitialLoadOverlay({ isHomePage = false, duration = 3 }: { isHomePage?: boolean; duration?: number }) {
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let fallbackTimer = 0;
    let observer: MutationObserver | null = null;
    const dismiss = () => {
      if (readyRef.current) return;
      readyRef.current = true;
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
      observer = new MutationObserver(watchHomepage);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-home-ready'], subtree: true });
      watchHomepage();
      window.addEventListener('homepage:scene-ready', dismiss);
      fallbackTimer = window.setTimeout(dismiss, 8000);
    } else if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss, { once: true });
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallbackTimer);
      observer?.disconnect();
      window.removeEventListener('homepage:scene-ready', dismiss);
      window.removeEventListener('load', dismiss);
    };
  }, [isHomePage]);

  return (
    <div
      aria-hidden={ready}
      style={isHomePage ? { transitionDuration: `${duration}s` } : undefined}
      className={`fixed inset-0 z-[120] flex items-center justify-center ${isHomePage ? 'bg-white' : 'bg-[#111827]'} transition-opacity ${isHomePage ? '' : 'duration-1000'} ease-in-out motion-reduce:transition-none ${ready ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      {!isHomePage && <div className="initial-load-content"><BrandLoadingContent /></div>}
    </div>
  );
}
