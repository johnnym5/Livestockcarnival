"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";

const zones = [
  { id: "agro", name: "Zone 1: Agro-Commerce", desc: "Livestock farming & agro-technology", lat: 9.042998005532722, lng: 7.487429114828819, color: "#1E4D38" }, // Green
  { id: "culinary", name: "Zone 2: Twilight Suya & Culinary", desc: "Open-flame suya village and artisanal culinary displays", lat: 9.0418, lng: 7.4878, color: "#F59E0B" }, // Amber
  { id: "equestrian", name: "Zone 3: Equestrian", desc: "Horse riding and displays", lat: 9.0435, lng: 7.4895, color: "#3B82F6" }, // Blue
  { id: "trace", name: "Zone 4: Traceability", desc: "Tech and tracking solutions", lat: 9.0432, lng: 7.4910, color: "#8B5CF6" }, // Purple
  { id: "vip", name: "Zone 5: VIP/Protocol", desc: "Special guests and protocol", lat: 9.0440, lng: 7.4883, color: "#EF4444" }, // Red
  { id: "logistics", name: "Zone 6: Parking/Logistics", desc: "Parking and event logistics", lat: 9.0422, lng: 7.4912, color: "#6B7280" }, // Gray
];

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 18, {
      duration: 1.5,
    });
  }, [center, map]);
  return null;
}

export default function VenueMapClient() {
  const [activeZone, setActiveZone] = useState<[number, number]>([9.0428, 7.4890]);
  const [mapImageryConsent, setMapImageryConsent] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-[#E5E7EB] overflow-y-auto flex-shrink-0 z-10 relative shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#111827] mb-2 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-[#1E4D38]" />
            Venue Zones
          </h2>
          <p className="text-sm text-[#4B5563] mb-6">Select a zone to locate it on the map.</p>
          
          <div className="space-y-3">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setActiveZone([zone.lat, zone.lng])}
                className="w-full text-left p-4 border border-[#E5E7EB] hover:border-[#1E4D38] hover:bg-[#FBFBFA] transition-colors rounded-sm group flex items-start"
              >
                <div 
                  className="w-4 h-4 rounded-full mt-1 mr-3 flex-shrink-0"
                  style={{ backgroundColor: zone.color }}
                />
                <div>
                  <h3 className="font-semibold text-[#111827] group-hover:text-[#1E4D38] transition-colors text-sm">
                    {zone.name}
                  </h3>
                  <p className="text-xs text-[#4B5563] mt-1">{zone.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-[#FEF3D6] text-[#8D6B1B] rounded-sm">
            <h4 className="font-semibold mb-1 flex items-center text-sm">
              <Navigation className="w-4 h-4 mr-1" /> Getting Here
            </h4>
            <p className="text-xs">Old Parade Ground, Area 10, Garki, Abuja. Use main entrance for Zones 1-3.</p>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-grow relative h-full">
        <MapContainer
          center={[9.0428, 7.4890]}
          zoom={17}
          className="w-full h-full z-0"
          zoomControl={false}
        >
          {mapImageryConsent === 'accepted' ? <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
          /> : null}
          <MapController center={activeZone} />
          
          {zones.map((zone) => (
            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lng]}
              pathOptions={{ fillColor: zone.color, color: "#ffffff", weight: 2, fillOpacity: 0.8 }}
              radius={12}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-[#111827] text-sm mb-1">{zone.name}</h3>
                  <p className="text-xs text-[#4B5563] m-0">{zone.desc}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        {mapImageryConsent === 'pending' && <div className="absolute inset-x-3 top-3 z-[500] mx-auto max-w-md rounded-xl border border-[#DCE3DC] bg-white/95 p-4 text-center shadow-lg backdrop-blur-sm">
          <p className="text-sm font-bold text-[#17251D]">Load Google satellite imagery?</p>
          <p className="mt-1 text-xs leading-5 text-[#59635D]">Google may receive your IP address and browser information when map tiles load. Venue zones remain available without loading the imagery.</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={() => setMapImageryConsent('accepted')} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1E4D38] px-4 text-xs font-bold text-white">Load map imagery <ExternalLink aria-hidden="true" size={14} /></button>
            <button type="button" onClick={() => setMapImageryConsent('rejected')} className="min-h-10 rounded-lg border border-[#DCE3DC] px-4 text-xs font-semibold text-[#354139]">Keep imagery off</button>
          </div>
          <a className="mt-2 block text-[11px] font-semibold text-[#1E4D38] underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
        </div>}
        {mapImageryConsent === 'rejected' && <div className="absolute inset-x-3 top-3 z-[500] mx-auto flex max-w-md flex-wrap items-center justify-center gap-2 rounded-xl border border-[#DCE3DC] bg-white/95 p-3 text-center shadow-lg backdrop-blur-sm">
          <p className="text-xs text-[#59635D]">Google imagery is off. Venue zones remain available.</p>
          <button type="button" onClick={() => setMapImageryConsent('accepted')} className="min-h-9 rounded-lg border border-[#1E4D38]/30 px-3 text-xs font-semibold text-[#1E4D38]">Load imagery</button>
        </div>}
      </div>
    </div>
  );
}
