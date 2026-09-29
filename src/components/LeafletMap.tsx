'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Navigation, Compass, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { slidePanelRight, staggerParent, staggerChildItem } from '@/lib/motion';
import 'leaflet/dist/leaflet.css';

interface ZoneItem {
  id: string;
  name: string;
  region: string;
  desc: string;
  lat: number;
  lng: number;
  color: string;
}

const zones: ZoneItem[] = [
  {
    id: 'zone-1',
    name: 'Zone 1: Agro-Commerce & Live-Weight Market',
    region: 'NW West Field (Basketball Court Area)',
    desc: 'Precision digital scale weighing, certified kilogram livestock trade, and direct pastoral commerce.',
    lat: 9.042998005532722,
    lng: 7.487429114828819,
    color: '#1E4D38',
  },
  {
    id: 'zone-2',
    name: 'Zone 2: Twilight Suya & Culinary Village',
    region: 'SW West Field',
    desc: 'Artisanal open-flame suya grills, vacuum-sealed kilishi craft, and verified hygienic meat tasting.',
    lat: 9.0418,
    lng: 7.4878,
    color: '#8D6B1B',
  },
  {
    id: 'zone-3',
    name: 'Zone 3: Grand Durbar & Equestrian Oval',
    region: 'Central Track & Field',
    desc: 'Royal cavalry displays, 200+ decorated war horses, kakaki fanfare, and ceremonial presidential review.',
    lat: 9.0435,
    lng: 7.4895,
    color: '#2563EB',
  },
  {
    id: 'zone-4',
    name: 'Zone 4: Digital Traceability & Cold-Chain Hub',
    region: 'East Complex',
    desc: 'Biometric RFID ear-tagging telemetry, modular abattoir pods, and BOI agro-finance window.',
    lat: 9.0432,
    lng: 7.491,
    color: '#7C3AED',
  },
  {
    id: 'zone-5',
    name: 'Zone 5: Presidential Pavilion & Protocol Concourse',
    region: 'North Grandstand',
    desc: 'VVIP protocol clearance, ministerial plenary arena, and inter-zonal bilateral accord signing.',
    lat: 9.044,
    lng: 7.4883,
    color: '#DC2626',
  },
  {
    id: 'zone-6',
    name: 'Zone 6: Public Parking & Livestock Transport Logistics',
    region: 'South-East Access Gate',
    desc: 'Dedicated reefer truck staging, animal holding pens, and visitor vehicular security screening.',
    lat: 9.0422,
    lng: 7.4912,
    color: '#4B5563',
  },
];

function MapFlyTo({ target }: { target: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(target, 18, {
      duration: 1.4,
    });
  }, [target, map]);
  return null;
}

export default function LeafletMap() {
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([
    9.0428, 7.489,
  ]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-1');

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-70px)] sm:h-[calc(100vh-80px)] w-full overflow-hidden bg-[#FBFBFA]">
      {/* Satellite Map Container - Top on Mobile, Right on Desktop */}
      <div className="w-full lg:flex-1 h-[45dvh] lg:h-full relative min-h-[280px] order-1 lg:order-2 shrink-0 lg:shrink">
        <MapContainer
          center={[9.0428, 7.489]}
          zoom={17}
          className="w-full h-full z-0"
          zoomControl={true}
        >
          {/* Google Satellite Hybrid Tiles */}
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution="&copy; Google Satellite Imagery"
            maxZoom={20}
          />

          <MapFlyTo target={selectedCoords} />

          {/* Precision Zone Markers */}
          {zones.map((zone) => (
            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lng]}
              pathOptions={{
                fillColor: zone.color,
                color: '#ffffff',
                weight: 2.5,
                fillOpacity: 0.9,
              }}
              radius={11}
            >
              <Popup>
                <div className="p-1 max-w-xs font-sans">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#1E4D38] mb-1">
                    <Compass className="w-3 h-3" />
                    <span>{zone.region}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#111827] mb-1">
                    {zone.name}
                  </h4>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {zone.desc}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-500 font-mono">
                    GPS: {zone.lat.toFixed(6)}, {zone.lng.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Zone Navigator Side Panel - Bottom on Mobile, Left on Desktop */}
      <motion.div
        variants={slidePanelRight}
        initial="initial"
        animate="animate"
        className="w-full lg:w-96 h-[55dvh] lg:h-full bg-white border-t lg:border-t-0 lg:border-r border-[#E5E7EB] flex flex-col shrink-0 z-10 shadow-xl order-2 lg:order-1"
      >
        {/* Panel Header */}
        <div className="p-4 sm:p-6 border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-[#1E4D38]" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#1E4D38]">
              Interactive Spatial Zones
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
            Old Parade Ground Sectors
          </h2>
          <p className="text-xs text-[#4B5563] mt-0.5 line-clamp-2">
            Select a sector below to pinpoint GPS coordinates on the interactive satellite arena map.
          </p>
        </div>

        {/* Zones List with Scroll Container */}
        <motion.div
          variants={staggerParent}
          initial="initial"
          animate="animate"
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2"
        >
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;

            return (
              <motion.button
                key={zone.id}
                variants={staggerChildItem}
                layout
                onClick={() => {
                  setSelectedCoords([zone.lat, zone.lng]);
                  setSelectedZoneId(zone.id);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-[#1E4D38] bg-[#D8EADF]/30 shadow-sm'
                    : 'border-[#E5E7EB] hover:border-[#B8D8C5] bg-white'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full mt-1 shrink-0 ring-2 ring-white"
                  style={{ backgroundColor: zone.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-xs text-[#111827] truncate">
                      {zone.name.split(':')[0]}
                    </h3>
                    <span className="text-[9.5px] sm:text-[10px] text-[#4B5563] uppercase tracking-wider font-semibold shrink-0">
                      {zone.region.split('(')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-[#111827] font-medium mt-0.5">
                    {zone.name.split(':')[1]}
                  </p>
                  <p className="text-[11px] text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
                    {zone.desc}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Panel Footer */}
        <div className="p-3.5 sm:p-4 bg-[#FEF3D6] border-t border-[#FCE6A8] text-[#8D6B1B] shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Navigation className="w-3.5 h-3.5" />
            <span>Perimeter Dispatch</span>
          </div>
          <p className="text-[10.5px] sm:text-[11px] mt-0.5 text-[#8D6B1B]/90 leading-tight">
            Pedestrian Gates 1 &amp; 2 open from 08:00 AM daily. Show accredited digital pass or VIP badge at perimeter checkpoint.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
