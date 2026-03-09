'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Soldier } from '@/lib/types';
import { TILE_URL, TILE_ATTRIBUTION } from '@/lib/constants';
import styles from './ProfileMap.module.css';

interface ProfileMapProps {
  soldier: Soldier;
}

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

export const ProfileMap = ({ soldier }: ProfileMapProps) => (
  <div className={styles.wrapper}>
    <MapContainer
      center={[soldier.coordinates.lat, soldier.coordinates.lng]}
      zoom={10}
      className={styles.map}
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
  </div>
);
