'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Compass } from 'lucide-react';
import L from 'leaflet';
import type { Soldier } from '@/lib/types';
import { MAP_CENTER, MAP_ZOOM_DEFAULT, TILE_URL, TILE_ATTRIBUTION, BRANCH_COLOR_MAP } from '@/lib/constants';
import { formatDateEnglish } from '@/lib/soldiers';

const makePinIcon = (selected: boolean, color: string): L.DivIcon =>
  L.divIcon({
    className: '',
    html: `<div class="pin-container${selected ? ' pin-selected' : ''}">
      <svg viewBox="0 0 24 32" width="${selected ? 30 : 24}" height="${selected ? 40 : 32}">
        <path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 24 8 24s8-18 8-24c0-4.4-3.6-8-8-8z"
          fill="${selected ? '#fb923c' : color}" opacity="0.95"/>
        <text x="12" y="11" text-anchor="middle" font-size="8" fill="#000" font-family="serif">✡</text>
      </svg>
    </div>`,
    iconSize: selected ? [30, 40] : [24, 32],
    iconAnchor: selected ? [15, 40] : [12, 32],
    popupAnchor: [0, -34],
  });

const FlyTo = ({ soldier }: { soldier: Soldier | null }) => {
  const map = useMap();
  useEffect(() => {
    if (!soldier?.coordinates) return;
    map.flyTo([soldier.coordinates.lat, soldier.coordinates.lng], 11, { duration: 1.2 });
  }, [soldier, map]);
  return null;
};

const CoordTracker = ({ onCenter }: { onCenter: (lat: number, lng: number) => void }) => {
  useMapEvents({
    move(e) { const c = e.target.getCenter(); onCenter(c.lat, c.lng); },
  });
  return null;
};

interface MapViewProps {
  soldiers: Soldier[];
  selectedSoldier: Soldier | null;
  onSoldierSelect: (s: Soldier) => void;
}

export const MapView = ({ soldiers, selectedSoldier, onSoldierSelect }: MapViewProps) => {
  const [center, setCenter] = useState<[number, number]>(MAP_CENTER);
  const mappedSoldiers = useMemo(() => soldiers.filter((s) => s.coordinates), [soldiers]);

  return (
    <div className="h-full relative bg-gray-900/30 overflow-hidden">

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none z-10" />

      {/* Compass */}
      <div className="absolute top-12 right-4 z-20 pointer-events-none">
        <div className="w-14 h-14 border-2 border-cyan-400/60 rounded-full flex items-center justify-center bg-black/60 glow">
          <Compass className="w-7 h-7 text-cyan-400" />
        </div>
      </div>

      {/* Scale + status bottom right */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <div className="bg-black/70 border border-cyan-400/30 rounded p-2 font-mono text-xs text-cyan-400">
          <div>SCALE</div>
          <div>{center[0].toFixed(2)}°N, {center[1].toFixed(2)}°E</div>
          <div className="mt-1 text-[10px]">
            STATUS: <span className="text-green-400 animate-pulse">ACTIVE</span>
            <span className="text-gray-500"> / MEMORIAL ARCHIVE</span>
          </div>
        </div>
      </div>

      {/* Memorial info bottom left */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <div className="bg-black/70 border border-cyan-400/30 rounded p-2">
          <div className="text-cyan-400 text-xs font-medium font-mono">IDF MEMORIAL</div>
          <div className="text-[10px] text-gray-400 font-mono">OPERATIONAL THEATER v1.0</div>
        </div>
      </div>

      {/* Leaflet map */}
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM_DEFAULT}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <FlyTo soldier={selectedSoldier} />
        <CoordTracker onCenter={(lat, lng) => setCenter([lat, lng])} />

        <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
          {mappedSoldiers.map((soldier) => {
            const isSelected = selectedSoldier?.id === soldier.id;
            const color = BRANCH_COLOR_MAP[soldier.unit_branch] ?? '#fb923c';
            return (
              <Marker
                key={soldier.id}
                position={[soldier.coordinates!.lat, soldier.coordinates!.lng]}
                icon={makePinIcon(isSelected, color)}
                eventHandlers={{ click: () => onSoldierSelect(soldier) }}
              >
                <Popup>
                  <div className="popup-card">
                    <div className="popup-name-he">{soldier.name_he}</div>
                    <div className="popup-name-en">{soldier.name_en}</div>
                    <div className="popup-rank">{soldier.rank_en}{soldier.rank_en && ' · '}{soldier.unit}</div>
                    <div className="popup-date">{formatDateEnglish(soldier.date_of_fall)}</div>
                    <div className="popup-location">📍 {soldier.location_name}</div>
                    <a href={`/soldiers/${soldier.id}`} className="popup-link">לפרופיל המלא →</a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};
