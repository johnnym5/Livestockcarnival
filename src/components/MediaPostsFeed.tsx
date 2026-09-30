'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CalendarDays, FileText, Newspaper, RotateCw, X } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { MediaPost } from '@/lib/cms';
import { supabase } from '@/lib/supabase/client';

export default function MediaPostsFeed() {
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [activePost, setActivePost] = useState<MediaPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPublishedPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('media_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (!active) return;
        if (error) {
          setLoadFailed(true);
          return;
        }
        setPosts((data ?? []) as MediaPost[]);
      } catch {
        if (active) setLoadFailed(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadPublishedPosts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activePost) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePost(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePost]);

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2" aria-label="Loading published stories">
          {[0, 1].map((item) => <div key={item} className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}
        </div>
      ) : loadFailed ? (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-center">
          <p className="text-sm font-bold text-rose-900">Published stories are temporarily unavailable.</p>
          <p className="mt-1 text-xs text-rose-800">Please try again shortly.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-rose-300 bg-white px-3 text-xs font-bold text-rose-900"><RotateCw className="h-3.5 w-3.5" /> Retry</button>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#C9D4CA] bg-white px-6 py-14 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF2EA] text-[#315F3C]"><Newspaper className="h-5 w-5" /></span>
          <h3 className="mt-4 text-base font-extrabold text-[#17251D]">No stories published yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#68746C]">Newly published newsroom stories will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {posts.map((post, index) => (
            <ScrollReveal key={post.id} direction="up" delay={index * 0.08} duration={0.9}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card card-lift">
                {post.cover_image_url ? (
                  <div className="relative h-52 overflow-hidden bg-[#E8EEE8]">
                    <Image src={post.cover_image_url} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="relative grid h-28 place-items-center overflow-hidden bg-gradient-to-br from-[#113B27] via-[#17472F] to-[#0A1A10] text-[#E4B03A]">
                    <FileText className="h-7 w-7 opacity-75" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(228,176,58,.24),transparent_35%)]" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#E7F1E9] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#285A3A]">{post.category}</span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#737F76]"><CalendarDays className="h-3.5 w-3.5" />{post.published_at ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(post.published_at)) : 'Newsroom'}</span>
                  </div>
                  <h3 className="text-xl font-extrabold leading-snug text-[#17251D]">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#5D6B61]">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#EDF0EC] pt-5">
                    <span className="text-[11px] font-semibold text-[#8D6B1B]">Official newsroom</span>
                    <button type="button" onClick={() => setActivePost(post)} className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1E4D38] transition hover:text-[#8D6B1B]">
                      Read story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      )}

      {activePost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07150D]/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePost(null); }}>
          <article role="dialog" aria-modal="true" aria-labelledby="media-story-title" className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#FBFCFA] shadow-2xl">
            <button type="button" onClick={() => setActivePost(null)} aria-label="Close story" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#07150D]/75 text-white backdrop-blur hover:bg-[#07150D]"><X className="h-4 w-4" /></button>
            {activePost.cover_image_url && (
              <div className="relative h-56 bg-[#E8EEE8] sm:h-80"><Image src={activePost.cover_image_url} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 768px" className="object-cover" /></div>
            )}
            <div className="p-6 sm:p-10">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#8D6B1B]">{activePost.category}</span>
              <h2 id="media-story-title" className="mt-3 text-2xl font-black leading-tight text-[#17251D] sm:text-4xl">{activePost.title}</h2>
              <p className="mt-4 border-b border-[#E3E8E2] pb-6 text-base leading-7 text-[#58665C]">{activePost.excerpt}</p>
              {activePost.body && (
                <div className="space-y-5 py-6 text-sm leading-7 text-[#35453A]">
                  {activePost.body.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              )}
            </div>
          </article>
        </div>
      )}
    </>
  );
}
