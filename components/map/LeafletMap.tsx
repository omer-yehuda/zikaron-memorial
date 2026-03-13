'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      const L = (await import('leaflet')).default;

      if (mapRef.current) return; // already initialised

      const map = L.map(containerRef.current!, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Voyager — colorful, shows roads/terrain/water
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      mapRef.current = map;
      setMapReady(true); // trigger marker sync now that map exists
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
      setMapReady(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync markers — runs when map becomes ready OR soldiers list changes
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
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

        const symbol = soldier.gender === 'female'
          ? `<g stroke="white" stroke-width="1.2" fill="none">
               <line x1="14" y1="7"  x2="14" y2="19"/>
               <line x1="8"  y1="19" x2="20" y2="19"/>
               <path d="M8 14 Q8 10 14 10 Q20 10 20 14"/>
               <line x1="8"  y1="10" x2="8"  y2="19"/>
               <line x1="11" y1="11" x2="11" y2="19"/>
               <line x1="17" y1="11" x2="17" y2="19"/>
               <line x1="20" y1="10" x2="20" y2="19"/>
             </g>`
          : `<text x="14" y="19" text-anchor="middle" font-size="12" fill="white" font-family="Arial">✡</text>`;

        const icon = L.divIcon({
          className: '',
          html: `
            <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z"
                fill="${branchColor}" fill-opacity="0.9" stroke="rgba(0,0,0,0.5)" stroke-width="1"/>
              ${symbol}
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
  }, [mapReady, soldiers]);

  // Pan to selected
  useEffect(() => {
    if (!selected || !mapRef.current) return;
    mapRef.current.setView([selected.lat, selected.lng], 11, { animate: true });
    markersRef.current.get(selected.id)?.openPopup();
  }, [selected]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />;
}
