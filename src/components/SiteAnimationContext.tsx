'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_SITE_ANIMATION, type SiteAnimationValues } from '@/lib/siteAnimation';

export const SiteAnimationContext = createContext<SiteAnimationValues>(DEFAULT_SITE_ANIMATION.defaults);
export const useSiteAnimation = () => useContext(SiteAnimationContext);
