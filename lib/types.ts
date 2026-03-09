export interface Soldier {
  id: string;
  name_he: string;
  name_en: string;
  rank_he: string;
  rank_en: string;
  unit: string;
  unit_branch: 'ground' | 'navy' | 'air' | 'special';
  date_of_birth: string;
  date_of_fall: string;
  location_name: string;
  coordinates: { lat: number; lng: number };
  city_of_origin: string;
  photo_url?: string;
  bio_he?: string;
  bio_en?: string;
  age_at_fall: number;
  conflict: string;
  source_url?: string;
}

export type UnitBranch = Soldier['unit_branch'];

export interface SoldierStats {
  total: number;
  byBranch: Record<UnitBranch, number>;
  byMonth: Record<string, number>;
  citiesCount: number;
  unitsCount: number;
  daysSinceStart: number;
}

export interface BranchConfig {
  id: UnitBranch;
  label_he: string;
  label_en: string;
  color: string;
}

export interface MapLabel {
  name: string;
  lat: number;
  lng: number;
  type: 'city' | 'region';
}
