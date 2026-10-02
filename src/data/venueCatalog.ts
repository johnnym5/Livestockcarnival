export interface CarnivalVenue {
  id: string;
  name: string;
  zone: string;
  description: string;
  latitude: number;
  longitude: number;
  image: string;
}

export const VENUE_COLORS = ['#1E4D38', '#C2410C', '#2563EB', '#7C3AED', '#BE123C', '#0F766E', '#A16207', '#334155'] as const;

export function venueColor(index: number) {
  return VENUE_COLORS[index % VENUE_COLORS.length];
}

export const DEFAULT_VENUES: CarnivalVenue[] = [
  { id: 'zone-1', name: 'Agro-Commerce & Live-Weight Market', zone: 'North-West Field', description: 'Precision livestock weighing, certified trade, and pastoral commerce.', latitude: 9.042998, longitude: 7.487429, image: '/assets/attractions/arena-breed-judging-court.jpg' },
  { id: 'zone-2', name: 'Twilight Suya & Culinary Village', zone: 'South-West Field', description: 'Open-flame suya, kilishi craft, spice markets, and festival dining.', latitude: 9.0418, longitude: 7.4878, image: '/assets/home/story-suya-market-couples.jpg' },
  { id: 'zone-3', name: 'Grand Durbar & Equestrian Oval', zone: 'Central Track & Field', description: 'Royal cavalry displays, decorated horses, and ceremonial pageantry.', latitude: 9.0435, longitude: 7.4895, image: '/assets/home/story-equestrian-durbar-parade.jpg' },
  { id: 'zone-4', name: 'Digital Traceability & Cold-Chain Hub', zone: 'East Complex', description: 'Livestock traceability demonstrations, cold-chain technology, and workshops.', latitude: 9.0432, longitude: 7.491, image: '/assets/attractions/arena-traceability-coldchain-hub.jpg' },
  { id: 'zone-5', name: 'Presidential Pavilion & Protocol Concourse', zone: 'North Grandstand', description: 'Protocol reception, ministerial sessions, and official ceremonies.', latitude: 9.044, longitude: 7.4883, image: '/assets/venue-map/old-parade-ground-map-annotated.jpg' },
  { id: 'zone-6', name: 'Public Parking & Livestock Transport Logistics', zone: 'South-East Access Gate', description: 'Visitor parking, livestock transport staging, and perimeter access.', latitude: 9.0422, longitude: 7.4912, image: '/assets/venue-map/old-parade-ground-map-clean.jpg' },
];

export const DEFAULT_EVENT_VENUES: Record<string, string[]> = {
  'd1-b1': ['zone-5'],
  'd1-b2': ['zone-3', 'zone-5'],
  'd1-b3': ['zone-4'],
  'd1-b4': ['zone-3'],
  'd2-b1': ['zone-5'],
  'd2-b2': ['zone-1', 'zone-3'],
  'd2-b3': ['zone-4'],
  'd2-b4': ['zone-3'],
  'd3-b1': ['zone-1', 'zone-4'],
  'd3-b2': ['zone-3', 'zone-5'],
  'd3-b3': ['zone-5'],
  'd3-b4': ['zone-3'],
};
