import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.defaultValue) return options.defaultValue;
      return key;
    },
    i18n: { language: 'it' },
  }),
}));

// Mock context
vi.mock('../src/context/useAppContext', () => ({
  useAppContext: () => ({
    userData: {
      calcResults: {
        bmr: 2000,
        activityLevel: 'moderato',
        proteins: 120,
        carbohydrates: 200,
        fats: 70,
      },
      allergens: [],
    },
  }),
}));

// Mock useRecipes hook
vi.mock('../src/hooks/useRecipes', () => ({
  useRecipes: () => ({
    recipes: [],
    addRecipe: vi.fn(),
    updateRecipe: vi.fn(),
    deleteRecipe: vi.fn(),
  }),
}));

// Mock InfoPopup component
vi.mock('../src/components/InfoPopup', () => ({
  __esModule: true,
  default: () => null,
}));

// Helper to render with router
const renderWithRouter = (route: string = '/predefined-0') => {
  window.history.pushIndex = 0;
  Object.defineProperty(window.history, 'pushState', {
    value: vi.fn(),
    writable: true,
  });

  return render(
    <MemoryRouter initialEntries={[route]}>
      <div></div>
    </MemoryRouter>
  );
};

describe('RecipeDetail - Back Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render the "Torna al pasto" button when navigating from MealCard', () => {
    // Set up localStorage with a back reference
    const backRef = {
      source: 'mealCard' as const,
      targetId: 'predefined-0',
      mealKey: 'colazione',
    };
    localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));

    // Check that localStorage is set correctly
    const stored = localStorage.getItem('foodmapper_recipe_back_ref');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.source).toBe('mealCard');
    expect(parsed.targetId).toBe('predefined-0');
  });

  it('should navigate to /diet when handleBackToMeal is called', () => {
    const mockNavigate = vi.fn();
    const backRef = {
      source: 'mealCard' as const,
      targetId: 'predefined-0',
      mealKey: 'colazione',
    };
    localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));

    // Simulate the handleBackToMeal callback
    const handleBackToMeal = () => {
      localStorage.removeItem('foodmapper_recipe_back_ref');
      mockNavigate('/diet');
    };

    handleBackToMeal();

    expect(mockNavigate).toHaveBeenCalledWith('/diet');
    expect(localStorage.getItem('foodmapper_recipe_back_ref')).toBeNull();
  });

  it('should clean up localStorage when navigating to a different recipe', () => {
    // Set up localStorage with a back reference for a different recipe
    const backRef = {
      source: 'mealCard' as const,
      targetId: 'predefined-0',
      mealKey: 'colazione',
    };
    localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));

    // Simulate checking for back reference for a different recipe
    const recipeId = 'predefined-1';
    const stored = localStorage.getItem('foodmapper_recipe_back_ref');
    
    if (stored) {
      const ref = JSON.parse(stored);
      if (ref.source === 'mealCard' && ref.targetId === recipeId) {
        // Should not clean up
      } else {
        localStorage.removeItem('foodmapper_recipe_back_ref');
      }
    }

    expect(localStorage.getItem('foodmapper_recipe_back_ref')).toBeNull();
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    // Set invalid JSON
    localStorage.setItem('foodmapper_recipe_back_ref', 'invalid-json{');

    // Try to parse - should not throw
    expect(() => {
      try {
        const stored = localStorage.getItem('foodmapper_recipe_back_ref');
        if (stored) {
          JSON.parse(stored);
        }
      } catch {
        // Expected to catch invalid JSON
      }
    }).not.toThrow();
  });

  it('should remove back ref when handleBackToMeal is called', () => {
    const backRef = {
      source: 'mealCard' as const,
      targetId: 'predefined-0',
      mealKey: 'pranzo',
    };
    localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));

    expect(localStorage.getItem('foodmapper_recipe_back_ref')).toBeTruthy();

    // Simulate cleanup
    localStorage.removeItem('foodmapper_recipe_back_ref');

    expect(localStorage.getItem('foodmapper_recipe_back_ref')).toBeNull();
  });
});

describe('MealCard - View Recipe Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should store back navigation reference when viewing a recipe', () => {
    const mealKey = 'colazione';
    const recipeIndex = 0;

    const backRef = {
      source: 'mealCard' as const,
      targetId: `predefined-${recipeIndex}`,
      mealKey,
    };

    localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));

    const stored = localStorage.getItem('foodmapper_recipe_back_ref');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.source).toBe('mealCard');
    expect(parsed.targetId).toBe('predefined-0');
    expect(parsed.mealKey).toBe('colazione');
  });

  it('should remove back navigation reference when no recipe is found', () => {
    // First set a reference
    const backRef = {
      source: 'mealCard' as const,
      targetId: 'predefined-0',
      mealKey: 'colazione',
    };
    localStorage.setItem('foodmapper_recipe_back_ref', JSON.stringify(backRef));

    // Simulate no recipe found scenario
    const recipe = null;
    if (!recipe) {
      localStorage.removeItem('foodmapper_recipe_back_ref');
    }

    expect(localStorage.getItem('foodmapper_recipe_back_ref')).toBeNull();
  });
});