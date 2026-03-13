import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/ui/Header';

describe('Header', () => {
  it('renders Hebrew title "זיכרון"', () => {
    render(
      <Header totalFallen={150} searchQuery="" onSearchChange={() => {}} />
    );
    expect(screen.getAllByText('זיכרון').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Hebrew subtitle', () => {
    render(
      <Header totalFallen={150} searchQuery="" onSearchChange={() => {}} />
    );
    expect(screen.getByText('לזכר חללי צה״ל ישראל')).toBeTruthy();
  });

  it('has a search input', () => {
    render(
      <Header totalFallen={150} searchQuery="" onSearchChange={() => {}} />
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeTruthy();
  });

  it('shows the fallen counter label in Hebrew', () => {
    render(
      <Header totalFallen={150} searchQuery="" onSearchChange={() => {}} />
    );
    expect(screen.getByText('נפלו לאחר אחינו')).toBeTruthy();
  });

  it('calls onSearchChange when input changes', () => {
    const onSearchChange = vi.fn();
    render(
      <Header totalFallen={0} searchQuery="" onSearchChange={onSearchChange} />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Cohen' } });
    expect(onSearchChange).toHaveBeenCalledWith('Cohen');
  });

  it('shows current search query value', () => {
    render(
      <Header totalFallen={0} searchQuery="Golani" onSearchChange={() => {}} />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Golani');
  });
});
