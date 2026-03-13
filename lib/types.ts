export type Branch = 'infantry' | 'armor' | 'navy' | 'air_force' | 'special_forces' | 'engineering' | 'intelligence' | 'artillery' | 'other';

export interface Soldier {
  id: string;
  name_he: string;
  name_en: string;
  gender: 'male' | 'female';
  rank_he: string;
  rank_en: string;
  unit_he: string;
  unit_en: string;
  branch: Branch;
  date_of_death: string; // ISO date YYYY-MM-DD
  age: number;
  city_he: string;
  city_en: string;
  lat: number;
  lng: number;
  description_he?: string;
  description_en?: string;
  photo_url?: string;
}

export interface SoldierWithCandles extends Soldier {
  candle_count: number;
}

export interface Stats {
  total: number;
  by_branch: Record<Branch, number>;
  by_month: Record<string, number>; // "YYYY-MM" -> count
  first_date: string;
  last_date: string;
}

export interface CandlePayload {
  soldier_id: string;
  count: number;
  last_lit_at: string;
}
