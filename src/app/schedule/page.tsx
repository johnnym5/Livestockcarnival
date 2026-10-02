import { Metadata } from 'next';
import ScheduleVenueClient from '@/components/ScheduleVenueClient';

export const metadata: Metadata = {
  title: 'Official Carnival Schedule & Venue Map | National Livestock Carnival 2026',
  description: 'Browse the three-day carnival schedule and explore event venues on the interactive map.',
};

export default function SchedulePage() {
  return <ScheduleVenueClient initialView="schedule" />;
}
