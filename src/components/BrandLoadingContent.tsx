import Image from 'next/image';

export default function BrandLoadingContent() {
  return (
    <div className="relative flex flex-col items-center gap-5">
      <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:h-32 sm:w-32">
        <Image
          src="/assets/branding/carnival-logo-solid.jpeg"
          alt="Livestock Carnival Loading"
          fill
          priority
          sizes="128px"
          className="object-cover"
        />
      </div>

      <div className="mt-2 flex items-center gap-2" aria-hidden="true">
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#D4AF37] [animation-delay:-0.3s]" />
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#D4AF37] [animation-delay:-0.15s]" />
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#D4AF37]" />
      </div>

      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
        Livestock Carnival 2026
      </span>
    </div>
  );
}
