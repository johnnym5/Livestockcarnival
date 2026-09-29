import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111827]">
      <div className="relative flex flex-col items-center gap-5">
        {/* Logo with Green Background preserved */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-pulse">
          <Image
            src="/assets/logo.jpeg"
            alt="Livestock Carnival Loading"
            fill
            priority
            sizes="128px"
            className="object-cover"
          />
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-bounce" />
        </div>

        <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#D4AF37]">
          Livestock Carnival 2026
        </span>
      </div>
    </div>
  );
}
