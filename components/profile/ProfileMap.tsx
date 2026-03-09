'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Soldier } from '@/lib/types';
import { TILE_URL, TILE_ATTRIBUTION } from '@/lib/constants';
import { Box, Text } from '@/components/ui/primitives';

const pinIcon = L.divIcon({
  className: '',
  html: `<div class="pin-container">
    <svg viewBox="0 0 24 32" width="24" height="32">
      <path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 24 8 24s8-18 8-24c0-4.4-3.6-8-8-8z"
        fill="#f4a261" opacity="0.95"/>
      <text x="12" y="11" text-anchor="middle" font-size="8" fill="#0a0a0f" font-family="serif">✡</text>
    </svg>
  </div>`,
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -34],
});

interface ProfileMapProps {
  soldier: Soldier;
}

export const ProfileMap = ({ soldier }: ProfileMapProps) => {
  if (!soldier.coordinates) {
    return (
      <Box className="rounded-lg overflow-hidden border border-electric/20 h-[220px] flex items-center justify-center bg-bg-card/60 flex-col gap-2">
        <Text className="text-[24px]">📍</Text>
        <Text className="text-muted text-[13px]">Location not recorded</Text>
        <Text className="font-he text-[12px] text-muted/60 [direction:rtl]">
          מיקום לא ידוע
        </Text>
      </Box>
    );
  }

  return (
    <Box className="rounded-lg overflow-hidden border border-electric/20 h-[220px]">
      <MapContainer
        center={[soldier.coordinates.lat, soldier.coordinates.lng]}
        zoom={10}
        className="w-full h-full"
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <Marker
          position={[soldier.coordinates.lat, soldier.coordinates.lng]}
          icon={pinIcon}
        >
          <Popup>
            <div className="popup-card">
              <div className="popup-name-he">{soldier.name_he}</div>
              <div className="popup-location">📍 {soldier.location_name}</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};
