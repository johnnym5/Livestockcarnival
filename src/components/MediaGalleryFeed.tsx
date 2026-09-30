'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Check, Images, RotateCw, Share2, X } from 'lucide-react';
import { MediaGallery } from '@/lib/cms';
import { supabase } from '@/lib/supabase/client';

export default function MediaGalleryFeed() {
  const [galleries, setGalleries] = useState<MediaGallery[]>([]);
  const [activeImage, setActiveImage] = useState<{ gallery: MediaGallery; index: number } | null>(null);
  const [copiedGalleryId, setCopiedGalleryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data, error } = await supabase.from('media_galleries').select('*').eq('status', 'published').order('published_at', { ascending: false });
        if (!active) return;
        if (error) setLoadFailed(true);
        else {
          const loadedGalleries = (data ?? []) as MediaGallery[];
          setGalleries(loadedGalleries);

          // Check deep-link query parameter ?gallery=id
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const galleryId = params.get('gallery');
            if (galleryId) {
              const matched = loadedGalleries.find((g) => g.id === galleryId);
              if (matched && matched.images.length > 0) {
                setActiveImage({ gallery: matched, index: 0 });
              }
            }
          }
        }
      } catch {
        if (active) setLoadFailed(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!activeImage) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setActiveImage(null); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [activeImage]);

  const handleShareGallery = async (gallery: MediaGallery) => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/media?gallery=${encodeURIComponent(gallery.id)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedGalleryId(gallery.id);
      setTimeout(() => setCopiedGalleryId(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Loading published galleries">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="aspect-[4/3] animate-pulse rounded-xl bg-[#E9EEE8]" />
          ))}
        </div>
      ) : loadFailed ? (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-center">
          <p className="text-sm font-bold text-rose-900">Published galleries are temporarily unavailable.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-rose-300 bg-white px-3 text-xs font-bold text-rose-900">
            <RotateCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      ) : galleries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#C9D4CA] bg-white px-6 py-12 text-center">
          <Images className="mx-auto h-6 w-6 text-[#52725A]" />
          <h3 className="mt-3 text-sm font-extrabold text-[#17251D]">No galleries published yet</h3>
          <p className="mt-1 text-xs text-[#68746C]">Photo galleries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {galleries.map((gallery) => (
            <section key={gallery.id} id={`gallery-${gallery.id}`} aria-labelledby={`gallery-title-${gallery.id}`}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 id={`gallery-title-${gallery.id}`} className="text-lg font-extrabold text-[#17251D]">
                    {gallery.name}
                  </h3>
                  {gallery.description && <p className="mt-1 max-w-3xl text-sm leading-6 text-[#68746C]">{gallery.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleShareGallery(gallery)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1E7E0] bg-white px-3 py-1.5 text-xs font-bold text-[#3B5443] transition hover:border-[#1E4D38] hover:bg-[#F3F7F2]"
                >
                  {copiedGalleryId === gallery.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5 text-[#1E4D38]" />}
                  {copiedGalleryId === gallery.id ? 'Link copied!' : 'Share gallery'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {gallery.images.map((image, index) => (
                  <button
                    key={image.path}
                    type="button"
                    onClick={() => setActiveImage({ gallery, index })}
                    aria-label={`View ${image.alt || `image ${index + 1}`} from ${gallery.name}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#E9EEE8] text-left"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {activeImage && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#07150D]/90 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveImage(null);
          }}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            aria-label="Close image"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="w-full max-w-5xl">
            <div className="relative mx-auto h-[72vh] w-full">
              <Image
                src={activeImage.gallery.images[activeImage.index].url}
                alt={activeImage.gallery.images[activeImage.index].alt}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {activeImage.gallery.images[activeImage.index].alt || activeImage.gallery.name} · {activeImage.index + 1} / {activeImage.gallery.images.length}
            </figcaption>
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                disabled={activeImage.index === 0}
                onClick={() => setActiveImage((current) => (current ? { gallery: current.gallery, index: current.index - 1 } : current))}
                className="h-10 rounded-lg border border-white/25 px-4 text-sm font-semibold text-white disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={activeImage.index >= activeImage.gallery.images.length - 1}
                onClick={() => setActiveImage((current) => (current ? { gallery: current.gallery, index: current.index - 1 + 2 } : current))}
                className="h-10 rounded-lg border border-white/25 px-4 text-sm font-semibold text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </figure>
        </div>
      )}
    </>
  );
}
