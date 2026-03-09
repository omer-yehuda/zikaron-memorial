'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
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
import styles from './MapView.module.css';

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

interface FlyToProps {
  soldier: Soldier | null;
}

const FlyTo = ({ soldier }: FlyToProps) => {
  const map = useMap();
  useEffect(() => {
    if (!soldier) return;
    map.flyTo([soldier.coordinates.lat, soldier.coordinates.lng], 11, {
      duration: 1.2,
    });
  }, [soldier, map]);
  return null;
};

interface CoordTrackerProps {
  onCenter: (lat: number, lng: number) => void;
}

const CoordTracker = ({ onCenter }: CoordTrackerProps) => {
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

export const MapView = ({ soldiers, selectedSoldier, onSoldierSelect }: MapViewProps) => {
  const [center, setCenter] = useState<[number, number]>(MAP_CENTER);

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.hudFrame} />
      <div className={`${styles.hudCorner} ${styles.hudCornerTL}`} />
      <div className={`${styles.hudCorner} ${styles.hudCornerTR}`} />
      <div className={`${styles.hudCorner} ${styles.hudCornerBL}`} />
      <div className={`${styles.hudCorner} ${styles.hudCornerBR}`} />
      <div className={styles.tacticalLabel}>TACTICAL OVERLAY · IDF MEMORIAL</div>

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM_DEFAULT}
        className={styles.mapContainer}
        zoomControl={false}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <FlyTo soldier={selectedSoldier} />
        <CoordTracker onCenter={(lat, lng) => setCenter([lat, lng])} />

        <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
          {soldiers.map((soldier) => {
            const isSelected = selectedSoldier?.id === soldier.id;
            const color = BRANCH_COLOR_MAP[soldier.unit_branch] ?? '#f4a261';
            return (
              <Marker
                key={soldier.id}
                position={[soldier.coordinates.lat, soldier.coordinates.lng]}
                icon={makePinIcon(isSelected, color)}
                eventHandlers={{ click: () => onSoldierSelect(soldier) }}
              >
                <Popup>
                  <div className="popup-card">
                    <div className="popup-name-he">{soldier.name_he}</div>
                    <div className="popup-name-en">{soldier.name_en}</div>
                    <div className="popup-rank">
                      {soldier.rank_en} · {soldier.unit}
                    </div>
                    <div className="popup-date">
                      {formatDateEnglish(soldier.date_of_fall)}
                    </div>
                    <div className="popup-location">📍 {soldier.location_name}</div>
                    <a href={`/soldiers/${soldier.id}`} className="popup-link">
                      לפרופיל המלא →
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      <div className={styles.coordsReadout}>
        {`${center[0].toFixed(4)}°N · ${center[1].toFixed(4)}°E`}
      </div>
    </div>
  );
};
