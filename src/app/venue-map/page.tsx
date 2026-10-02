import { Metadata } from 'next';
import ScheduleVenueClient from '@/components/ScheduleVenueClient';

export const metadata: Metadata = {
  title: 'Interactive Venue Map & Schedule | National Livestock Carnival 2026',
  description: 'Explore carnival venues alongside the official three-day event schedule.',
};

export default function VenueMapPage() {
  return <ScheduleVenueClient initialView="map" />;
}
