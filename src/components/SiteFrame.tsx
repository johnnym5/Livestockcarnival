'use client';

import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import InitialLoadOverlay from '@/components/InitialLoadOverlay';
import { DEFAULT_SITE_ANIMATION, normalizeSiteAnimation, resolveSiteAnimation, type SiteAnimationDocument, type SiteAnimationValues } from '@/lib/siteAnimation';
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
    void supabase.from('site_animation_settings').select('settings').eq('id', 1).maybeSingle().then(({ data }) => {
      if (active && data?.settings) setAnimationDocument(normalizeSiteAnimation(data.settings));
    });
    return () => { active = false; };
  }, [isWorkspaceRoute]);

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
          </motion.div>
        </AnimatePresence>
        {!isWorkspaceRoute && <LiveChatWidget />}
      </div>
      </SiteAnimationContext.Provider>
    </SmoothScroll>
  );
}
