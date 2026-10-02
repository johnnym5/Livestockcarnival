'use client';

import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import Footer from '@/components/Footer';
import PushOptIn from '@/components/PushOptIn';
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import InitialLoadOverlay from '@/components/InitialLoadOverlay';
import { DEFAULT_SITE_ANIMATION, getTransitionFrame, normalizeSiteAnimation, resolveSiteAnimation, SITE_ANIMATION_STORAGE_KEY, SITE_ANIMATION_UPDATED_EVENT, type SiteAnimationDocument, type SiteAnimationValues } from '@/lib/siteAnimation';
import { supabase } from '@/lib/supabase/client';
import { PageTransitionContext, SiteAnimationContext } from '@/components/SiteAnimationContext';
import type { CSSProperties } from 'react';

const LiveChatWidget = dynamic(() => import('@/components/LiveChatWidget'), {
  ssr: false,
  loading: () => null,
});

interface PendingNavigation {
  href: string;
  external: boolean;
}

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isWorkspaceRoute = pathname.startsWith('/admin') || pathname.startsWith('/editor');
  const reduceMotion = useReducedMotion();
  const [animationDocument, setAnimationDocument] = useState<SiteAnimationDocument>(DEFAULT_SITE_ANIMATION);
  const [leaving, setLeaving] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const navigationRef = useRef<PendingNavigation | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (pendingPath === pathname) {
      if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, [pathname, pendingPath]);

  useEffect(() => () => {
    if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current);
  }, []);

  const animation: SiteAnimationValues = isWorkspaceRoute
    ? DEFAULT_SITE_ANIMATION.defaults
    : resolveSiteAnimation(animationDocument, pathname);
  const incomingTransition = pendingPath === pathname;
  const shouldExit = leaving && !incomingTransition;
  const incomingFrame = getTransitionFrame(animation.transitionInEffect, 'in', animation);
  const outgoingFrame = getTransitionFrame(animation.transitionOutEffect, 'out', animation);
  const incomingDuration = reduceMotion ? 0 : animation.transitionInDuration;
  const outgoingDuration = reduceMotion ? 0 : animation.transitionOutDuration;

  const finishOutgoing = () => {
    const pending = navigationRef.current;
    if (!pending) return;
    navigationRef.current = null;
    if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = null;
    if (pending.external) {
      window.location.assign(pending.href);
      return;
    }
    router.push(pending.href);
  };

  const handleNavigation = (event: MouseEvent<HTMLElement>) => {
    if (navigationRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download') || anchor.getAttribute('href')?.startsWith('#')) return;

    try {
      const destination = new URL(anchor.href, window.location.href);
      if (destination.protocol !== 'https:' && destination.protocol !== 'http:') return;
      const external = destination.origin !== window.location.origin;
      const destinationWorkspace = destination.pathname.startsWith('/admin') || destination.pathname.startsWith('/editor');
      if (!external && (destination.pathname === pathname || isWorkspaceRoute || destinationWorkspace)) return;
      const nextHref = external ? destination.href : `${destination.pathname}${destination.search}${destination.hash}`;
      event.preventDefault();
      event.stopPropagation();
      if (reduceMotion || animation.transitionOutDuration === 0) {
        if (!reduceMotion && !external && animation.transitionInDuration > 0) setPendingPath(destination.pathname);
        if (external) window.location.assign(nextHref);
        else router.push(nextHref);
        return;
      }

      navigationRef.current = { href: nextHref, external };
      setPendingPath(external ? null : destination.pathname);
      setLeaving(true);
      fallbackTimerRef.current = window.setTimeout(finishOutgoing, animation.transitionOutDuration * 1000 + 150);
    } catch {
      // Ignore malformed URLs and let the link's normal behavior continue.
    }
  };

  const pageAnimation = shouldExit
    ? { ...outgoingFrame, transition: { duration: outgoingDuration, ease: 'easeIn' as const } }
    : { opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1, transition: { duration: incomingTransition ? incomingDuration : 0, ease: 'easeOut' as const } };
  const initialPageAnimation = incomingTransition && incomingDuration > 0 ? incomingFrame : false;

  return (
    <SmoothScroll enabled={!isWorkspaceRoute && pathname !== '/'} duration={animation.scrollDuration}>
      <SiteAnimationContext.Provider value={animation}>
        <PageTransitionContext.Provider value={incomingTransition}>
          <div id="site-shell" data-skeletons={animation.skeletonEnabled} className="flex flex-1 flex-col bg-white" style={{ '--site-interaction-duration': `${reduceMotion ? 0 : animation.interactionDuration}s`, '--site-skeleton-duration': `${animation.skeletonDuration}s` } as CSSProperties} onClickCapture={handleNavigation}>
            <InitialLoadOverlay isHomePage={pathname === '/'} duration={animation.homepageRevealDuration} />
            {!isWorkspaceRoute && <Header />}
            <motion.div
              key={pathname}
              initial={initialPageAnimation}
              animate={pageAnimation}
              onAnimationComplete={() => {
                if (shouldExit) finishOutgoing();
                else if (incomingTransition) {
                  setLeaving(false);
                  setPendingPath(null);
                }
              }}
              className="flex flex-1 flex-col bg-white"
            >
              <main className="flex-1">{children}</main>
              {!isWorkspaceRoute && <Footer />}
              {!isWorkspaceRoute && <PushOptIn />}
            </motion.div>
            {!isWorkspaceRoute && <LiveChatWidget />}
          </div>
        </PageTransitionContext.Provider>
      </SiteAnimationContext.Provider>
    </SmoothScroll>
  );
}
