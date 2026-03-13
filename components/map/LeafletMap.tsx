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

      // Dark base layer — CartoDB Dark Matter (no {r} placeholder so tiles always resolve)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        crossOrigin: true,
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

        // Pentagon points (flat-top, centered at 13,13, radius 11)
        const pentagonPts = [0,1,2,3,4].map(i => {
          const a = (Math.PI / 2) + (2 * Math.PI * i) / 5; // start at top
          return `${13 + 11 * Math.cos(a)},${13 - 11 * Math.sin(a)}`;
        }).join(' ');

        const symbol = soldier.gender === 'female'
          // Menorah
          ? `<g stroke="#fde047" stroke-width="1.3" fill="none">
               <line x1="13" y1="6"  x2="13" y2="19"/>
               <line x1="7"  y1="19" x2="19" y2="19"/>
               <path d="M7 13 Q7 9 13 9 Q19 9 19 13"/>
               <line x1="7"  y1="9"  x2="7"  y2="19"/>
               <line x1="10" y1="10" x2="10" y2="19"/>
               <line x1="16" y1="10" x2="16" y2="19"/>
               <line x1="19" y1="9"  x2="19" y2="19"/>
             </g>`
          // Star of David
          : `<g>
               <polygon points="13,5 15.5,10 21,10 16.5,14 18.5,19 13,16 7.5,19 9.5,14 5,10 10.5,10"
                 fill="#fde047" fill-opacity="0.95" stroke="none"/>
             </g>`;

        const icon = L.divIcon({
          className: '',
          html: `
            <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow-${soldier.id}" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="2.5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <!-- Glow halo -->
              <polygon points="${pentagonPts}" fill="#fde047" fill-opacity="0.25" stroke="none"/>
              <!-- Pentagon body -->
              <polygon points="${pentagonPts}"
                fill="#1d4ed8" stroke="#fde047" stroke-width="1.5"
                filter="url(#glow-${soldier.id})"/>
              ${symbol}
            </svg>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          popupAnchor: [0, -16],
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
