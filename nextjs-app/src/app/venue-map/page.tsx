'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-[#FBFBFA] text-[#1E4D38] gap-3">
      <div className="w-8 h-8 border-3 border-[#1E4D38] border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-semibold tracking-wider uppercase">
        Loading Satellite Venue GIS...
      </span>
    </div>
  ),
});

export default function VenueMapPage() {
  return (
    <div className="bg-[#FBFBFA] pt-20">
      <LeafletMap />
    </div>
  );
}
