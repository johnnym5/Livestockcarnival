'use client';

import { useEffect, useRef, useState } from 'react';
import BrandLoadingContent from '@/components/BrandLoadingContent';

export default function InitialLoadOverlay({ isHomePage = false }: { isHomePage?: boolean }) {
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
      const watchScene = () => {
        const scene = document.getElementById('scene-container');
        if (scene?.classList.contains('scene-ready')) {
          dismiss();
          observer?.disconnect();
        }
      };
      observer = new MutationObserver(watchScene);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'], subtree: true });
      watchScene();
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
      className={`fixed inset-0 z-[120] flex items-center justify-center ${isHomePage ? 'bg-white' : 'bg-[#111827]'} transition-opacity ${isHomePage ? 'duration-[5000ms]' : 'duration-1000'} ease-in-out motion-reduce:transition-none ${ready ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      {!isHomePage && <div className="initial-load-content"><BrandLoadingContent /></div>}
    </div>
  );
}
