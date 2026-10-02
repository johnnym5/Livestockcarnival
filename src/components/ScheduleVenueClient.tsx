'use client';

import dynamic from 'next/dynamic';

const ScheduleVenueExperience = dynamic(() => import('@/components/ScheduleVenueExperience'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#F7F8F5] pt-24 text-center text-sm font-semibold text-[#1E4D38]">Loading schedule and venue map...</div>,
});

export default function ScheduleVenueClient({ initialView }: { initialView: 'schedule' | 'map' }) {
  return <ScheduleVenueExperience initialView={initialView} />;
}
