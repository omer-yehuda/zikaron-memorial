'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import type { Soldier } from '@/lib/types';
import {
  MAP_CENTER,
  MAP_ZOOM_DEFAULT,
  TILE_URL,
  TILE_ATTRIBUTION,
  BRANCH_COLOR_MAP,
} from '@/lib/constants';
import { formatDateEnglish } from '@/lib/soldiers';
import { Box, Text } from '@/components/ui/primitives';

const makePinIcon = (selected: boolean, color: string): L.DivIcon =>
  L.divIcon({
    className: '',
    html: `<div class="pin-container${selected ? ' pin-selected' : ''}">
      <svg viewBox="0 0 24 32" width="${selected ? 30 : 24}" height="${selected ? 40 : 32}">
        <path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 24 8 24s8-18 8-24c0-4.4-3.6-8-8-8z"
          fill="${selected ? '#e63946' : color}" opacity="0.95"/>
        <text x="12" y="11" text-anchor="middle" font-size="8" fill="#0a0a0f" font-family="serif">✡</text>
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
    map.flyTo([soldier.coordinates.lat, soldier.coordinates.lng], 11, {
      duration: 1.2,
    });
  }, [soldier, map]);
  return null;
};

const CoordTracker = ({
  onCenter,
}: {
  onCenter: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    move(e) {
      const c = e.target.getCenter();
      onCenter(c.lat, c.lng);
    },
  });
  return null;
};

interface MapViewProps {
  soldiers: Soldier[];
  selectedSoldier: Soldier | null;
  onSoldierSelect: (s: Soldier) => void;
}

export const MapView = ({
  soldiers,
  selectedSoldier,
  onSoldierSelect,
}: MapViewProps) => {
  const [center, setCenter] = useState<[number, number]>(MAP_CENTER);
  const mappedSoldiers = useMemo(() => soldiers.filter((s) => s.coordinates), [soldiers]);

  return (
    <Box className="flex-1 relative overflow-hidden">
      {/* HUD frame */}
      <Box className="absolute inset-0 pointer-events-none z-[400] border border-electric/15" />
      <Box className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-electric z-[500] pointer-events-none" />
      <Box className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-electric z-[500] pointer-events-none" />
      <Box className="absolute bottom-9 left-2 w-5 h-5 border-b-2 border-l-2 border-electric z-[500] pointer-events-none" />
      <Box className="absolute bottom-9 right-2 w-5 h-5 border-b-2 border-r-2 border-electric z-[500] pointer-events-none" />
      <Text className="absolute top-3 right-4 font-mono text-[9px] text-electric/50 tracking-[0.15em] z-[500] pointer-events-none">
        TACTICAL OVERLAY · IDF MEMORIAL
      </Text>

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
            const color = BRANCH_COLOR_MAP[soldier.unit_branch] ?? '#f4a261';
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
                    <div className="popup-rank">
                      {soldier.rank_en}
                      {soldier.rank_en && ' · '}
                      {soldier.unit}
                    </div>
                    <div className="popup-date">
                      {formatDateEnglish(soldier.date_of_fall)}
                    </div>
                    <div className="popup-location">📍 {soldier.location_name}</div>
                    <a
                      href={`/soldiers/${soldier.id}`}
                      className="popup-link"
                    >
                      לפרופיל המלא →
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      <Text className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-bg/80 border border-electric/20 rounded px-2.5 py-0.5 font-mono text-[10px] text-electric z-[500] pointer-events-none whitespace-nowrap">
        {`${center[0].toFixed(4)}°N · ${center[1].toFixed(4)}°E`}
      </Text>
    </Box>
  );
};
