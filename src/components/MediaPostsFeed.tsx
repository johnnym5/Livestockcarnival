'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Copy,
  FileText,
  Link2,
  Newspaper,
  RotateCw,
  Share2,
  X,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { MediaPost } from '@/lib/cms';
import { supabase } from '@/lib/supabase/client';

export default function MediaPostsFeed() {
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [activePost, setActivePost] = useState<MediaPost | null>(null);
  const [sharePost, setSharePost] = useState<MediaPost | null>(null);
  const [copied, setCopied] = useState(false);
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
        const loadedPosts = (data ?? []) as MediaPost[];
        setPosts(loadedPosts);

        // Check deep-link query parameter ?story=slug
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const storySlug = params.get('story');
          if (storySlug) {
            const matched = loadedPosts.find((p) => p.slug === storySlug);
            if (matched) {
              setActivePost(matched);
            }
          }
        }
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
    if (!activePost) {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.has('story')) {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }
      return;
    }

    // Update URL parameter when viewing a story
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?story=${encodeURIComponent(activePost.slug)}`;
      window.history.replaceState({}, '', newUrl);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePost(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePost]);

  const getShareUrl = (post: MediaPost) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/media?story=${encodeURIComponent(post.slug)}`;
  };

  const handleCopyLink = async (post: MediaPost) => {
    const url = getShareUrl(post);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2" aria-label="Loading published stories">
          {[0, 1].map((item) => (
            <div key={item} className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : loadFailed ? (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-center">
          <p className="text-sm font-bold text-rose-900">Published stories are temporarily unavailable.</p>
          <p className="mt-1 text-xs text-rose-800">Please try again shortly.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-rose-300 bg-white px-3 text-xs font-bold text-rose-900"
          >
            <RotateCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#C9D4CA] bg-white px-6 py-14 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF2EA] text-[#315F3C]">
            <Newspaper className="h-5 w-5" />
          </span>
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
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#737F76]">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {post.published_at ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(post.published_at)) : 'Newsroom'}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold leading-snug text-[#17251D]">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#5D6B61]">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#EDF0EC] pt-5">
                    <button
                      type="button"
                      onClick={() => setSharePost(post)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1E7E0] bg-[#FBFCFA] px-3 py-1.5 text-xs font-bold text-[#3B5443] transition hover:border-[#1E4D38] hover:bg-[#F3F7F2]"
                      aria-label={`Share ${post.title}`}
                    >
                      <Share2 className="h-3.5 w-3.5 text-[#1E4D38]" /> Share
                    </button>
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

      {/* Story Detail Modal */}
      {activePost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07150D]/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePost(null); }}>
          <article role="dialog" aria-modal="true" aria-labelledby="media-story-title" className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#FBFCFA] shadow-2xl">
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSharePost(activePost)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#07150D]/75 px-4 text-xs font-bold text-white backdrop-blur hover:bg-[#07150D]"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <button type="button" onClick={() => setActivePost(null)} aria-label="Close story" className="grid h-10 w-10 place-items-center rounded-full bg-[#07150D]/75 text-white backdrop-blur hover:bg-[#07150D]">
                <X className="h-4 w-4" />
              </button>
            </div>
            {activePost.cover_image_url && (
              <div className="relative h-56 bg-[#E8EEE8] sm:h-80">
                <Image src={activePost.cover_image_url} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
              </div>
            )}
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#8D6B1B]">{activePost.category}</span>
                <span className="text-xs font-semibold text-[#737F76]">
                  {activePost.published_at ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(activePost.published_at)) : ''}
                </span>
              </div>
              <h2 id="media-story-title" className="mt-3 text-2xl font-black leading-tight text-[#17251D] sm:text-4xl">{activePost.title}</h2>
              <p className="mt-4 border-b border-[#E3E8E2] pb-6 text-base leading-7 text-[#58665C]">{activePost.excerpt}</p>
              {activePost.body && (
                <div className="space-y-5 py-6 text-sm leading-7 text-[#35453A]">
                  {activePost.body.split(/\n\s*\n/).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
              <div className="mt-8 flex items-center justify-between border-t border-[#E3E8E2] pt-6">
                <span className="text-xs font-semibold text-[#8D6B1B]">National Livestock Carnival Newsroom</span>
                <button
                  type="button"
                  onClick={() => setSharePost(activePost)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-extrabold text-white transition hover:bg-[#173D2E]"
                >
                  <Share2 className="h-4 w-4" /> Share story
                </button>
              </div>
            </div>
          </article>
        </div>
      )}

      {/* Share Modal */}
      {sharePost && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#07150D]/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSharePost(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="share-dialog-title" className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={() => setSharePost(null)}
              aria-label="Close share dialog"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[#F3F5F2] text-[#4F5D53] hover:bg-[#E4E9E3]"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF2EA] text-[#1E4D38]">
                <Share2 className="h-5 w-5" />
              </span>
              <div>
                <h3 id="share-dialog-title" className="text-base font-extrabold text-[#17251D]">Share Story</h3>
                <p className="text-xs text-[#68746C]">Copy link or share directly to social media</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#E4E9E3] bg-[#FBFCFA] p-3 text-xs text-[#35453A]">
              <p className="font-extrabold line-clamp-1">{sharePost.title}</p>
              <p className="mt-1 line-clamp-2 text-[#68746C]">{sharePost.excerpt}</p>
            </div>

            {/* Direct Link Copy Box */}
            <div className="mt-5 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#526057]">Story Link</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#DDE4DC] bg-[#F8FAF8] p-1.5">
                <Link2 className="ml-2 h-4 w-4 shrink-0 text-[#818D83]" />
                <input
                  readOnly
                  value={getShareUrl(sharePost)}
                  className="w-full bg-transparent px-1 text-xs text-[#17251D] outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopyLink(sharePost)}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#1E4D38] px-3.5 text-xs font-bold text-white transition hover:bg-[#173D2E]"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Social Share Grid */}
            <div className="mt-6 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#526057]">Share on Social Media</label>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${sharePost.title}\n${getShareUrl(sharePost)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[#DDE4DC] bg-white p-3 text-center transition hover:border-[#25D366] hover:bg-[#25D366]/5"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#25D366]/10 text-[#25D366] font-extrabold text-xs">WA</span>
                  <span className="text-[11px] font-bold text-[#27382D]">WhatsApp</span>
                </a>

                {/* X (Twitter) */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(sharePost.title)}&url=${encodeURIComponent(getShareUrl(sharePost))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[#DDE4DC] bg-white p-3 text-center transition hover:border-black hover:bg-black/5"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-black/10 text-black font-extrabold text-xs">X</span>
                  <span className="text-[11px] font-bold text-[#27382D]">Twitter / X</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(sharePost))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[#DDE4DC] bg-white p-3 text-center transition hover:border-[#1877F2] hover:bg-[#1877F2]/5"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#1877F2]/10 text-[#1877F2] font-extrabold text-xs">FB</span>
                  <span className="text-[11px] font-bold text-[#27382D]">Facebook</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl(sharePost))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[#DDE4DC] bg-white p-3 text-center transition hover:border-[#0A66C2] hover:bg-[#0A66C2]/5"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] font-extrabold text-xs">IN</span>
                  <span className="text-[11px] font-bold text-[#27382D]">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
