'use client';

import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Footer from '@/components/Footer';
import PushOptIn from '@/components/PushOptIn';
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import InitialLoadOverlay from '@/components/InitialLoadOverlay';
import { DEFAULT_SITE_ANIMATION, normalizeSiteAnimation, resolveSiteAnimation, SITE_ANIMATION_STORAGE_KEY, SITE_ANIMATION_UPDATED_EVENT, type SiteAnimationDocument, type SiteAnimationValues } from '@/lib/siteAnimation';
import { supabase } from '@/lib/supabase/client';
import { SiteAnimationContext } from '@/components/SiteAnimationContext';
import type { CSSProperties } from 'react';

const LiveChatWidget = dynamic(() => import('@/components/LiveChatWidget'), {
  ssr: false,
  loading: () => null,
});

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isWorkspaceRoute = pathname.startsWith('/admin') || pathname.startsWith('/editor');
  const reduceMotion = useReducedMotion();
  const [isLeavingForExternalPage, setIsLeavingForExternalPage] = useState(false);
  const [animationDocument, setAnimationDocument] = useState<SiteAnimationDocument>(DEFAULT_SITE_ANIMATION);

  useEffect(() => {
    let active = true;
    if (isWorkspaceRoute) return () => { active = false; };
    void Promise.resolve().then(() => {
      if (!active) return;
      try {
        const cached = window.localStorage.getItem(SITE_ANIMATION_STORAGE_KEY);
        if (cached) setAnimationDocument(normalizeSiteAnimation(JSON.parse(cached)));
      } catch {
        // A missing or stale local cache falls back to the database settings.
      }
    });
    void supabase.from('site_animation_settings').select('settings').eq('id', 1).maybeSingle().then(({ data }) => {
      if (active && data?.settings) {
        const normalized = normalizeSiteAnimation(data.settings);
        setAnimationDocument(normalized);
        try { window.localStorage.setItem(SITE_ANIMATION_STORAGE_KEY, JSON.stringify(normalized)); } catch { /* Storage may be unavailable. */ }
      }
    });
    return () => { active = false; };
  }, [isWorkspaceRoute]);

  useEffect(() => {
    const applySettings = (raw: unknown) => {
      if (!raw) return;
      const normalized = normalizeSiteAnimation(raw);
      setAnimationDocument(normalized);
      try { window.localStorage.setItem(SITE_ANIMATION_STORAGE_KEY, JSON.stringify(normalized)); } catch { /* Storage may be unavailable. */ }
    };
    const onSettingsUpdated = (event: Event) => applySettings((event as CustomEvent<unknown>).detail);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== SITE_ANIMATION_STORAGE_KEY || !event.newValue) return;
      try { applySettings(JSON.parse(event.newValue)); } catch { /* Ignore malformed cached settings. */ }
    };
    window.addEventListener(SITE_ANIMATION_UPDATED_EVENT, onSettingsUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(SITE_ANIMATION_UPDATED_EVENT, onSettingsUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const animation: SiteAnimationValues = isWorkspaceRoute
    ? DEFAULT_SITE_ANIMATION.defaults
    : resolveSiteAnimation(animationDocument, pathname);

  const handleInternalNavigation = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

    try {
      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin &&
        (destination.protocol === 'https:' || destination.protocol === 'http:')
      ) {
        event.preventDefault();
        event.stopPropagation();
        setIsLeavingForExternalPage(true);
        window.setTimeout(() => window.location.assign(destination.href), reduceMotion ? 0 : animation.transitionDuration * 1000);
      }
    } catch {
      // Ignore malformed URLs and let the link's normal behavior continue.
    }
  };

  const transitionSeconds = reduceMotion ? 0 : animation.transitionDuration;
  const blurValue = animation.transitionEffect === 'blur-fade' ? 'blur(8px)' : 'blur(0px)';
  const pageVariants = {
    enter: {
      opacity: 0,
      filter: animation.transitionEffect === 'blur-fade' ? 'blur(8px)' : 'blur(0px)',
      x: animation.transitionEffect === 'slide-fade' ? 18 : 0,
    },
    center: {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      transition: { duration: transitionSeconds, ease: 'easeOut' as const },
    },
    exit: {
      opacity: 0,
      filter: blurValue,
      x: animation.transitionEffect === 'slide-fade' ? -18 : 0,
      transition: { duration: transitionSeconds, ease: 'easeIn' as const },
    },
  };

  return (
    <SmoothScroll enabled={!isWorkspaceRoute && pathname !== '/'} duration={animation.scrollDuration}>
      <SiteAnimationContext.Provider value={animation}>
      <div id="site-shell" data-skeletons={animation.skeletonEnabled} className="flex flex-1 flex-col bg-white" style={{ '--site-interaction-duration': `${reduceMotion ? 0 : animation.interactionDuration}s`, '--site-skeleton-duration': `${animation.skeletonDuration}s` } as CSSProperties} onClickCapture={handleInternalNavigation}>
        <InitialLoadOverlay isHomePage={pathname === '/'} duration={animation.homepageRevealDuration} />
        {!isWorkspaceRoute && <Header />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            variants={pageVariants}
            initial="enter"
            animate={isLeavingForExternalPage ? 'exit' : 'center'}
            exit="exit"
            className="flex flex-1 flex-col bg-white"
          >
            <main className="flex-1">{children}</main>
            {!isWorkspaceRoute && <Footer />}
            {!isWorkspaceRoute && <PushOptIn />}
          </motion.div>
        </AnimatePresence>
        {!isWorkspaceRoute && <LiveChatWidget />}
      </div>
      </SiteAnimationContext.Provider>
    </SmoothScroll>
  );
}
