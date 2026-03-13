export const BRANCH_LABELS: Record<string, { he: string; en: string; color: string }> = {
  infantry:       { he: 'חי"ר',      en: 'Infantry',       color: '#22c55e' },
  armor:          { he: 'שריון',      en: 'Armor',          color: '#f59e0b' },
  navy:           { he: 'חיל הים',    en: 'Navy',           color: '#3b82f6' },
  air_force:      { he: 'חיל האוויר', en: 'Air Force',      color: '#06b6d4' },
  special_forces: { he: 'יחידות מיוחדות', en: 'Special Forces', color: '#a855f7' },
  engineering:    { he: 'הנדסה קרבית', en: 'Engineering',    color: '#f97316' },
  intelligence:   { he: 'מודיעין',    en: 'Intelligence',   color: '#ec4899' },
  artillery:      { he: 'תותחנים',   en: 'Artillery',      color: '#ef4444' },
  other:          { he: 'אחר',        en: 'Other',          color: '#6b7280' },
};

export const MAP_CENTER: [number, number] = [31.5, 34.8];
export const MAP_ZOOM = 7;

export const OPERATION_START = '2023-10-07';
export const OPERATION_NAME_HE = 'מלחמת חרבות ברזל';
export const OPERATION_NAME_EN = 'Operation Swords of Iron';
