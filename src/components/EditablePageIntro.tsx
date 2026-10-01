'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContent';

export default function EditablePageIntro({ page, className = '' }: { page: 'schedule' | 'livestock'; className?: string }) {
  const initial = DEFAULT_SITE_CONTENT[page];
  const [content, setContent] = useState<Record<string, unknown>>(initial);
  useEffect(() => {
    let active = true;
    void supabase.from('site_page_content').select('content').eq('page_key', page).eq('status', 'published').maybeSingle().then(({ data }) => {
      if (active && data?.content && typeof data.content === 'object') setContent({ ...initial, ...(data.content as Record<string, unknown>) });
    });
    return () => { active = false; };
  }, [page, initial]);
  return <section className={className}>
    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#D8EADF] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#1E4D38]"><span className="h-1.5 w-1.5 rounded-full bg-[#1E4D38]" />{String(content.eyebrow ?? content.badge ?? '')}</span>
    <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">{String(content.title ?? '')}</h1>
    <p className="mx-auto max-w-3xl text-base leading-relaxed text-[#4B5563] sm:text-lg">{String(content.intro ?? content.description ?? '')}</p>
  </section>;
}
