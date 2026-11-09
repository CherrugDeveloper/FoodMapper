import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DayNavigator } from '../src/components/DayNavigator';
import type { DietPlanState } from '../src/types/dietPlan';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'it' },
  }),
}));

const mockState: DietPlanState = {
  startDate: '2026-11-01',
  currentDayIndex: 0,
  days: [
    {
      dayIndex: 0,
      date: '2026-11-01',
      phase: 'phase0',
      isCompleted: false,
      meals: [],
      dailyTotals: { calories: 2000, proteins: 120, carbs: 200, fats: 70, fiber: 30 },
    },
    {
      dayIndex: 6,
      date: '2026-11-07', // Saturday
      phase: 'phase0',
      isCompleted: false,
      meals: [],
      dailyTotals: { calories: 2000, proteins: 120, carbs: 200, fats: 70, fiber: 30 },
    },
    {
      dayIndex: 7,
      date: '2026-11-08', // Sunday
      phase: 'phase0',
      isCompleted: false,
      meals: [],
      dailyTotals: { calories: 2000, proteins: 120, carbs: 200, fats: 70, fiber: 30 },
    },
    {
      dayIndex: 8,
      date: '2026-11-09', // Monday
      phase: 'phase0',
      isCompleted: false,
      meals: [],
      dailyTotals: { calories: 2000, proteins: 120, carbs: 200, fats: 70, fiber: 30 },
    },
  ],
  userPreferences: {
    calorieMultiplier: 1,
    macroRatioOverride: null,
  },
  version: 2,
};

describe('DayNavigator component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders weekend days with distinct red border and without wknd text badge', () => {
    const onNavigateToDate = vi.fn();
    render(
      <DayNavigator
        state={mockState}
        currentDayIndex={0}
        onNavigateToDate={onNavigateToDate}
      />
    );

    // Ensure no "wknd" text badges exist
    expect(screen.queryByText(/wknd/i)).not.toBeInTheDocument();

    // Weekend date button (2026-11-07 is a Saturday, 2026-11-08 is Sunday)
    // 2026-11-01 is also a Sunday
    const sundayBtn = screen.getByLabelText(/2026-11-01/);
    expect(sundayBtn.className).toContain('border-red-500');
  });

  it('renders subtle non-intrusive modal trigger button and clicking it does not navigate', () => {
    const onNavigateToDate = vi.fn();
    render(
      <DayNavigator
        state={mockState}
        currentDayIndex={0}
        onNavigateToDate={onNavigateToDate}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /Aggiungi o modifica nota/i });
    expect(editButtons.length).toBeGreaterThan(0);

    const firstEditBtn = editButtons[0];
    // Check subtle styling
    expect(firstEditBtn.className).toContain('opacity-40');
    expect(firstEditBtn.className).toContain('text-xs');

    // Click edit button - should open modal and stop propagation (onNavigateToDate not called)
    fireEvent.click(firstEditBtn);
    expect(onNavigateToDate).not.toHaveBeenCalled();

    // Modal dialog should appear
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('triggers onNavigateToDate with correct date string when day cell is clicked', () => {
    const onNavigateToDate = vi.fn();
    render(
      <DayNavigator
        state={mockState}
        currentDayIndex={0}
        onNavigateToDate={onNavigateToDate}
      />
    );

    const targetDayCell = screen.getByLabelText(/2026-11-09/);
    fireEvent.click(targetDayCell);

    expect(onNavigateToDate).toHaveBeenCalledTimes(1);
    expect(onNavigateToDate).toHaveBeenCalledWith('2026-11-09');
  });
});
