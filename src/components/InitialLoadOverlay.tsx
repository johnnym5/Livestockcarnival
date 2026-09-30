'use client';

import { useEffect, useState } from 'react';
import BrandLoadingContent from '@/components/BrandLoadingContent';

export default function InitialLoadOverlay() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let frame = 0;
    const dismiss = () => {
      frame = window.requestAnimationFrame(() => setReady(true));
    };

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss, { once: true });
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('load', dismiss);
    };
  }, []);

  return (
    <div
      aria-hidden={ready}
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-[#111827] transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${ready ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <div className="initial-load-content">
        <BrandLoadingContent />
      </div>
    </div>
  );
}
