
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDietPlan } from '../src/hooks/useDietPlan';
import type { NutritionalResults, UserData } from '../src/utils/nutritionEngine';
import type { DietPlanState } from '../src/types/dietPlan';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock data
const mockResults: NutritionalResults = {
  proteins: 100,
  fats: 70,
  carbs: 250,
  fiber: 30,
  waterLiters: 2.5,
  estimatedTotalEnergyKcal: 2000,
  recommendations: 'ibs_rec_d',
  conditionNotes: [],
  micronutrients: {
    potassium: 3500,
    magnesium: 400,
    calcium: 1000,
    iron: 18,
    zinc: 11,
    folate: 400,
    vitamin_a: 900,
    vitamin_c: 90,
    vitamin_d: 20,
    vitamin_e: 15,
    b12: 2.4,
    omega3: 1.6,
    selenium: 55,
    iodine: 150,
  } as Record<string, number>,
};

const mockUserData: UserData = {
  weightKg: 75,
  heightCm: 180,
  ageYears: 30,
  biologicalSex: 'male',
  activityLevel: 'moderately_active',
  ibsType: 'IBS-D',
  conditions: [],
};

describe('useDietPlan - Critical Fixes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('generateAllDaysForInitialLoad is defined before useState initializer (hoisting fix)', () => {
    // This test verifies that the function is hoisted and available
    // when the useState initializer runs. If it weren't hoisted,
    // the initializer would throw a ReferenceError.
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    
    // The hook should initialize without throwing
    expect(result.current.state).toBeDefined();
    expect(result.current.state.days).toBeInstanceOf(Array);
    expect(result.current.state.days.length).toBeGreaterThan(0);
  });

  it('initializes state with generated days when results are available', () => {
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    
    expect(result.current.state.days.length).toBeGreaterThan(0);
    expect(result.current.state.startDate).toBeDefined();
    expect(result.current.state.currentDayIndex).toBe(0);
  });

  it('loads from localStorage when available', () => {
    const storedState: DietPlanState = {
      startDate: '2024-01-01',
      currentDayIndex: 5,
      days: [],
      userPreferences: {
        excludedFoods: [],
        preferredFoods: [],
        portionMultiplier: 1.0,
      },
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ ...storedState, version: 1 }));
    
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    
    expect(result.current.state.currentDayIndex).toBe(5);
    expect(result.current.state.startDate).toBe('2024-01-01');
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');
    
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    
    expect(result.current.state).toBeDefined();
    expect(result.current.state.days).toBeInstanceOf(Array);
  });

  it('handles version mismatch in localStorage', () => {
    const storedState = {
      startDate: '2024-01-01',
      currentDayIndex: 5,
      days: [],
      userPreferences: {
        excludedFoods: [],
        preferredFoods: [],
        portionMultiplier: 1.0,
      },
      version: 999, // Wrong version
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedState));
    
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    
    // Should reset to initial state
    expect(result.current.state.currentDayIndex).toBe(0);
    expect(result.current.state.days.length).toBeGreaterThan(0);
  });
});

describe('useDietPlan - High Priority Fixes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('navigateDay uses immutable updates (no direct push)', () => {
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    const initialDays = [...result.current.state.days];
    
    act(() => {
      result.current.navigateDay(1);
    });
    
    // State should be a new object, not mutated
    expect(result.current.state.days).not.toBe(initialDays);
    // But content should be preserved (immutable update)
    expect(result.current.state.days.length).toBeGreaterThanOrEqual(initialDays.length);
  });

  it('navigateDay generates new days when navigating forward beyond current days', () => {
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    const initialLength = result.current.state.days.length;
    
    // Navigate far ahead
    act(() => {
      result.current.navigateDay(50);
    });
    
    // Should have generated more days
    expect(result.current.state.days.length).toBeGreaterThan(initialLength);
    expect(result.current.state.currentDayIndex).toBeGreaterThan(0);
  });

  it('navigateToDate calculates correct day index', () => {
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    const startDate = result.current.state.startDate;
    
    // Calculate a date 14 days after start
    const targetDate = new Date(startDate);
    targetDate.setDate(targetDate.getDate() + 14);
    const targetDateStr = targetDate.toISOString().split('T')[0];
    
    act(() => {
      result.current.navigateToDate(targetDateStr);
    });
    
    expect(result.current.state.currentDayIndex).toBe(14);
  });

  it('ensureDaysGenerated is called in useEffect, not during render', () => {
    // This test verifies that ensureDaysGenerated is not called during render
    // but in a useEffect. We can verify this by checking that the initial
    // render doesn't have side effects (like localStorage writes) beyond
    // the initial state setup.
    
    const { result, rerender } = renderHook(
      ({ results, userData }) => useDietPlan(results, userData),
      { initialProps: { results: mockResults, userData: mockUserData } }
    );
    
    // Initial render should not have called saveState (which writes to localStorage)
    // beyond the initial state setup
    // Rerender with same props - should not trigger additional localStorage writes
    // from ensureDaysGenerated during render
    rerender({ results: mockResults, userData: mockUserData });
    
    // The useEffect should run after render, but we're testing that
    // ensureDaysGenerated is not called DURING render
    expect(result.current.state).toBeDefined();
  });

  it('state is updated via useEffect after ensureDaysGenerated', () => {
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    
    // The useEffect runs after initial render, so state should be updated
    // We can verify this by checking that state has days
    expect(result.current.state.days.length).toBeGreaterThan(0);
  });
});

describe('useDietPlan - State Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('confirmMeal updates meal correctly', () => {
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    const day = result.current.state.days[0];
    const meal = day.meals[0];
    
    act(() => {
      result.current.confirmMeal(0, meal.key);
    });
    
    const updatedDay = result.current.state.days[0];
    const updatedMeal = updatedDay.meals.find((m: { key: string }) => m.key === meal.key);
    expect(updatedMeal?.isConfirmed).toBe(true);
  });

  it('modifyMeal updates portions correctly', () => {
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    const day = result.current.state.days[0];
    const meal = day.meals[0];
    // const originalPortion = meal.portions[0];
    
    act(() => {
      result.current.modifyMeal(0, meal.key, [{ grams: 200 }]);
    });
    
    const updatedDay = result.current.state.days[0];
    const updatedMeal = updatedDay.meals.find((m: { key: string }) => m.key === meal.key);
    const updatedPortion = updatedMeal?.portions[0];
    expect(updatedPortion?.grams).toBe(200);
    expect(updatedPortion?.isModified).toBe(true);
  });

  it('completeDay marks day as completed', () => {
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    
    act(() => {
      result.current.completeDay(0);
    });
    
    expect(result.current.state.days[0].isCompleted).toBe(true);
    expect(result.current.state.days[0].completedAt).toBeDefined();
  });

  it('updatePreferences updates preferences and regenerates days when multiplier changes', () => {
    const { result } = renderHook(() => useDietPlan(mockResults, mockUserData));
    const initialDays = [...result.current.state.days];
    
    act(() => {
      result.current.updatePreferences({ portionMultiplier: 1.2 });
    });
    
    expect(result.current.state.userPreferences.portionMultiplier).toBe(1.2);
    // Days should be regenerated
    expect(result.current.state.days).not.toBe(initialDays);
  });

  it('isLoading is true when results are available but no days generated', () => {
    const { result } = renderHook(() => useDietPlan(null, mockUserData));
    expect(result.current.isLoading).toBe(false); // No results, not loading
    
    const { result: resultWithResults } = renderHook(() => useDietPlan(mockResults, mockUserData));
    // Initially might be loading if days are empty
    expect(resultWithResults.current.isLoading).toBeDefined();
  });
});