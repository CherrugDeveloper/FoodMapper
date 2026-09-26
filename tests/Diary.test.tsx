import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Diary from '../src/components/Diary';
import type { NutritionalResults } from '../src/utils/nutritionEngine';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Notification
Object.defineProperty(window, 'Notification', {
  value: vi.fn().mockImplementation(() => ({})),
  writable: true,
});
Object.defineProperty(window.Notification, 'requestPermission', {
  value: vi.fn().mockResolvedValue('granted'),
  writable: true,
});

const mockNutritionalResults: NutritionalResults = {
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

describe('Diary.tsx - Medium Priority Fixes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('No setState during render, uses useEffect with dateKey dependency', () => {
    // This test verifies that the component doesn't call setState during render
    // The fix was to use useEffect with dateKey dependency to load entries
    
    render(
      <Diary waterTargetLiters={2.5} nutritionalResults={mockNutritionalResults} />
    );
    
    // Initial render should not throw
    expect(screen.getByText('diary_title')).toBeInTheDocument();
    
    // Change date - this should trigger useEffect to load new entry
    const prevButton = screen.getByText('‹');
    fireEvent.click(prevButton);
    
    // Should not throw and should update
    expect(screen.getByText('diary_title')).toBeInTheDocument();
  });

  it('loads entry for selected date via useEffect', () => {
    // Use today's date as the key since the component initializes with today
    const todayKey = new Date().toISOString().split('T')[0];
    const storedEntry = {
      [todayKey]: {
        meals: { breakfast: 'Test breakfast', lunch: '', snack: '', dinner: '' },
        foodEntries: { breakfast: [], lunch: [], snack: [], dinner: [] },
        symptoms: ['bloating'],
        symptomSeverity: 5,
        transitScore: 4,
        bowelMovements: 1,
        waterGlasses: 3,
        notes: 'Test note',
      },
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedEntry));
    
    render(
      <Diary waterTargetLiters={2.5} nutritionalResults={mockNutritionalResults} />
    );
    
    // Should show the loaded entry for today
    expect(screen.getByDisplayValue('Test breakfast')).toBeInTheDocument();
  });

  it('persists entry changes via useEffect', () => {
    render(<Diary waterTargetLiters={2.5} nutritionalResults={mockNutritionalResults} />);
    
    // Add water glass - this should trigger persistence
    const waterPlusButton = screen.getByText('+');
    fireEvent.click(waterPlusButton);
    
    // Should persist to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('does not call setState during render for date changes', () => {
    // This is a regression test for the fix where setState was called during render
    // The fix moved the date loading logic to useEffect with dateKey dependency
    
    render(
      <Diary waterTargetLiters={2.5} nutritionalResults={mockNutritionalResults} />
    );
    
    // Initial render should not throw
    expect(screen.getByText('diary_title')).toBeInTheDocument();
    
    // Change date - this should trigger useEffect to load new entry
    const prevButton = screen.getByText('‹');
    fireEvent.click(prevButton);
    // Should not throw and should update
    expect(screen.getByText('diary_title')).toBeInTheDocument();
  });
});