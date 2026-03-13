import type { BranchConfig } from './types';

export const CONFLICT_START_DATE = new Date('2023-10-07');
export const TIMELINE_END = new Date('2026-03-08');

export const MAP_CENTER: [number, number] = [31.5, 35.0];
export const MAP_ZOOM_DEFAULT = 7;

export const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const BRANCHES: BranchConfig[] = [
  {
    id: 'ground',
    label_he: 'יבשה',
    label_en: 'Ground',
    color: '#52b788',
  },
  {
    id: 'air',
    label_he: 'אוויר',
    label_en: 'Air',
    color: '#00b4d8',
  },
  {
    id: 'navy',
    label_he: 'ים',
    label_en: 'Navy',
    color: '#0077b6',
  },
  {
    id: 'special',
    label_he: 'מיוחד',
    label_en: 'Special',
    color: '#e63946',
  },
];

export const BRANCH_COLOR_MAP: Record<string, string> = {
  ground: '#52b788',
  air: '#00b4d8',
  navy: '#0077b6',
  special: '#e63946',
};
