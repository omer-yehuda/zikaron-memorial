import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SoldierPanel } from '@/components/panel/SoldierPanel';
import type { Soldier } from '@/lib/types';

const mockSoldier: Soldier = {
  id: 'IDF-001',
  name_he: 'יוסף כהן',
  name_en: 'Yosef Cohen',
  rank_he: 'סמל',
  rank_en: 'Corporal',
  unit: 'Golani Brigade',
  unit_branch: 'ground',
  date_of_birth: '1999-03-14',
  date_of_fall: '2023-10-08',
  location_name: "Kibbutz Be'eri",
  coordinates: { lat: 31.3858, lng: 34.5062 },
  city_of_origin: 'Haifa',
  age_at_fall: 24,
  conflict: 'Swords of Iron',
};

describe('SoldierPanel', () => {
  it('renders soldier names', () => {
    render(
      <SoldierPanel
        soldiers={[mockSoldier]}
        selectedSoldier={null}
        onSoldierSelect={() => {}}
      />
    );
    expect(screen.getByText('Yosef Cohen')).toBeTruthy();
    expect(screen.getByText('יוסף כהן')).toBeTruthy();
  });

  it('shows empty state when no soldiers', () => {
    render(
      <SoldierPanel
        soldiers={[]}
        selectedSoldier={null}
        onSoldierSelect={() => {}}
      />
    );
    expect(screen.getByText('אין חיילים בטווח זה')).toBeTruthy();
  });

  it('calls onSoldierSelect when card is clicked', () => {
    const onSelect = vi.fn();
    render(
      <SoldierPanel
        soldiers={[mockSoldier]}
        selectedSoldier={null}
        onSoldierSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText('Yosef Cohen'));
    expect(onSelect).toHaveBeenCalledWith(mockSoldier);
  });

  it('shows the soldier count', () => {
    render(
      <SoldierPanel
        soldiers={[mockSoldier]}
        selectedSoldier={null}
        onSoldierSelect={() => {}}
      />
    );
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('shows unit name', () => {
    render(
      <SoldierPanel
        soldiers={[mockSoldier]}
        selectedSoldier={null}
        onSoldierSelect={() => {}}
      />
    );
    expect(screen.getByText('Golani Brigade')).toBeTruthy();
  });
});
