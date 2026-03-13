'use client';

import { useEffect, useRef } from 'react';
import type { Soldier } from '@/lib/types';
import { BRANCH_LABELS, MAP_CENTER, MAP_ZOOM } from '@/lib/constants';

interface LeafletMapProps {
  soldiers: Soldier[];
  selected: Soldier | null;
  onSelect: (s: Soldier) => void;
}

// Leaflet is loaded dynamically client-side only
export default function LeafletMap({ soldiers, selected, onSelect }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<Map<string, import('leaflet').Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current) return;
    let L: typeof import('leaflet');

    (async () => {
      L = (await import('leaflet')).default;

      if (mapRef.current) return; // already initialised

      const map = L.map(containerRef.current!, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB',
        subdomains: 'abcd',
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      mapRef.current = map;
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    (async () => {
      const L = (await import('leaflet')).default;

      // Remove stale markers
      const currentIds = new Set(soldiers.map((s) => s.id));
      for (const [id, marker] of markersRef.current) {
        if (!currentIds.has(id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      }

      // Add new markers
      for (const soldier of soldiers) {
        if (markersRef.current.has(soldier.id)) continue;
        const branchColor = BRANCH_LABELS[soldier.branch]?.color ?? '#6b7280';

        const icon = L.divIcon({
          className: '',
          html: `
            <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z"
                fill="${branchColor}" fill-opacity="0.85" stroke="#000" stroke-width="1"/>
              <text x="14" y="18" text-anchor="middle" font-size="11" fill="white" font-family="Arial">✡</text>
            </svg>`,
          iconSize: [28, 36],
          iconAnchor: [14, 36],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([soldier.lat, soldier.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:Heebo,sans-serif;min-width:160px;direction:rtl">
              <strong style="color:#fff;font-size:14px">${soldier.name_he}</strong><br>
              <span style="color:#9ca3af;font-size:12px">${soldier.rank_en} · ${soldier.unit_en}</span><br>
              <span style="color:#06b6d4;font-size:11px;font-family:monospace">${soldier.date_of_death}</span>
            </div>`,
            { className: 'dark-popup' }
          )
          .on('click', () => onSelect(soldier));

        markersRef.current.set(soldier.id, marker);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soldiers]);

  // Pan to selected
  useEffect(() => {
    if (!selected || !mapRef.current) return;
    mapRef.current.setView([selected.lat, selected.lng], 11, { animate: true });
    markersRef.current.get(selected.id)?.openPopup();
  }, [selected]);

  return <div ref={containerRef} className="w-full h-full" />;
}
