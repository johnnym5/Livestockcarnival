"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";
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
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
          />
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
      </div>
    </div>
  );
}
