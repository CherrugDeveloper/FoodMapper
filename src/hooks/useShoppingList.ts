import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DayPlan, ShoppingListItem } from '../types/dietPlan';
import { FOODS_DATABASE } from '../utils/foodsData';

const SHOPPING_STORAGE_KEY = 'foodmapper_shopping';
const SHOPPING_CUSTOM_ITEMS_KEY = 'foodmapper_shopping_custom_items';

export type ShoppingUnit = 'g' | 'kg' | 'ml' | 'pcs';

export interface CustomShoppingListItem {
  foodId: string;
  foodName: string;
  category: string;
  totalGrams: number;
  unit: ShoppingUnit;
  estimatedCost?: number;
}

export interface UseShoppingListOptions {
  days?: DayPlan[];
  startDate?: string;
  endDate?: string;
  weekSize?: number; // days per shopping trip (default 7)
}

// Standard package sizes for rounding - per category
const PACKAGE_SIZES: Record<string, { unit: ShoppingUnit; sizes: number[] }> = {
  'Carboidrati/Cereali': { unit: 'g', sizes: [250, 500, 1000, 2000] },
  'Proteine/Formaggi': { unit: 'g', sizes: [100, 125, 200, 250, 500] },
  'Verdura': { unit: 'g', sizes: [200, 300, 500, 1000] },
  'Frutta': { unit: 'g', sizes: [500, 1000, 1500, 2000] },
  'Condimenti/Altro': { unit: 'g', sizes: [50, 100, 250, 500] },
  'proteine': { unit: 'g', sizes: [100, 125, 200, 250, 500] },
  'carboidrati': { unit: 'g', sizes: [250, 500, 1000, 2000] },
  'verdure': { unit: 'g', sizes: [200, 300, 500, 1000] },
  'frutta': { unit: 'g', sizes: [500, 1000, 1500, 2000] },
  'grassi': { unit: 'g', sizes: [50, 100, 250, 500, 1000] },
  'condimenti': { unit: 'g', sizes: [50, 100, 250, 500] },
  'bevande': { unit: 'ml', sizes: [250, 500, 750, 1000, 1500, 2000] },
  'altro': { unit: 'g', sizes: [50, 100, 250, 500] },
};

function roundToPackageSize(grams: number, category: string): { quantity: number; unit: ShoppingUnit } {
  const pkg = PACKAGE_SIZES[category] || PACKAGE_SIZES['altro'];
  const { unit, sizes } = pkg;
  
  // Convert to target unit
  const value = unit === 'kg' ? grams / 1000 : unit === 'ml' ? grams : grams;
  
  // Find the closest package size
  let closest = sizes[0];
  for (const size of sizes) {
    if (size >= value) {
      closest = size;
      break;
    }
    closest = size;
  }
  
  return { quantity: closest, unit };
}

export interface WeeklyShoppingTrip {
  weekIndex: number;
  startDayIndex: number;
  endDayIndex: number;
  startDate?: string;
  endDate?: string;
  items: ShoppingListItem[];
  totals: {
    items: number;
    grams: number;
    purchased: number;
    estimatedCost: number;
  };
}

export function useShoppingList(options: UseShoppingListOptions = {}) {
  const { days = [], weekSize = 7 } = options;
  void options;

  const [purchasedItems, setPurchasedItems] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(SHOPPING_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });

  const [customItems, setCustomItems] = useState<CustomShoppingListItem[]>(() => {
    try {
      const saved = localStorage.getItem(SHOPPING_CUSTOM_ITEMS_KEY);
      return saved ? (JSON.parse(saved) as CustomShoppingListItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(purchasedItems));
    } catch {
      // Storage may be full or unavailable; the in-memory state remains functional.
    }
  }, [purchasedItems]);

  useEffect(() => {
    try {
      localStorage.setItem(SHOPPING_CUSTOM_ITEMS_KEY, JSON.stringify(customItems));
    } catch {
      // Storage may be full or unavailable; the in-memory state remains functional.
    }
  }, [customItems]);

  const generatedItems = useMemo(() => {
    const aggregated = new Map<string, ShoppingListItem>();

    days.forEach((day) => {
      day.meals.forEach((meal) => {
        meal.portions.forEach((portion) => {
          const existing = aggregated.get(portion.foodId);
          if (existing) {
            aggregated.set(portion.foodId, {
              ...existing,
              totalGrams: existing.totalGrams + portion.grams,
              daysNeeded: [...existing.daysNeeded, day.dayIndex],
            });
          } else {
            aggregated.set(portion.foodId, {
              foodId: portion.foodId,
              foodName: portion.foodName,
              category: FOODS_DATABASE.find((food) => food.id === portion.foodId)?.category ?? 'Condimenti/Altro',
              totalGrams: portion.grams,
              unit: portion.grams >= 1000 ? 'kg' : 'g',
              daysNeeded: [day.dayIndex],
              isPurchased: false,
              purchasedAt: purchasedItems[portion.foodId] || undefined,
            });
          }
        });
      });
    });

    return Array.from(aggregated.values()).sort((a, b) => a.foodName.localeCompare(b.foodName));
  }, [days, purchasedItems]);

  const allItems = useMemo<ShoppingListItem[]>(() => {
    const manual = customItems.map((custom): ShoppingListItem => ({
      ...custom,
      daysNeeded: [],
      isPurchased: !!purchasedItems[custom.foodId],
      purchasedAt: purchasedItems[custom.foodId] || undefined,
    }));
    const merged = new Map<string, ShoppingListItem>();

    generatedItems.forEach((item) => merged.set(item.foodId, item));
    manual.forEach((item) => merged.set(item.foodId, item));

    return Array.from(merged.values()).sort((a, b) => a.foodName.localeCompare(b.foodName));
  }, [generatedItems, customItems, purchasedItems]);

  // Group items into weekly trips
  const weeklyTrips = useMemo<WeeklyShoppingTrip[]>(() => {
    if (days.length === 0) return [];
    
    const maxDayIndex = Math.max(...days.map(d => d.dayIndex));
    const numWeeks = Math.ceil((maxDayIndex + 1) / weekSize);
    const trips: WeeklyShoppingTrip[] = [];
    
    for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
      const startDayIndex = weekIndex * weekSize;
      const endDayIndex = Math.min(startDayIndex + weekSize - 1, maxDayIndex);
      
      const startDate = days.find(d => d.dayIndex === startDayIndex)?.date;
      const endDate = days.find(d => d.dayIndex === endDayIndex)?.date;
      
      // Filter items needed for this week
      const weekItems: ShoppingListItem[] = allItems.map(item => {
        // Check if item is needed in this week
        const daysInWeek = item.daysNeeded.filter(d => d >= startDayIndex && d <= endDayIndex);
        if (daysInWeek.length === 0 && !item.foodId.startsWith('custom-')) {
          return null;
        }
        
        // Calculate total grams for this week
        const weekGrams = item.foodId.startsWith('custom-')
          ? item.totalGrams
          : (item.totalGrams / item.daysNeeded.length) * daysInWeek.length;
        
        // Round to package size
        const { quantity, unit } = roundToPackageSize(Math.round(weekGrams), item.category);
        
        return {
          ...item,
          totalGrams: quantity * (unit === 'kg' ? 1000 : 1),
          unit,
          daysNeeded: daysInWeek,
        };
      }).filter((item): item is ShoppingListItem => item !== null);
      
      const totals = {
        items: weekItems.length,
        grams: weekItems.reduce((sum, item) => sum + item.totalGrams, 0),
        purchased: weekItems.filter((item) => item.isPurchased).length,
        estimatedCost: weekItems.reduce((sum, item) => sum + (item.estimatedCost ?? 0), 0),
      };
      
      trips.push({
        weekIndex,
        startDayIndex,
        endDayIndex,
        startDate,
        endDate,
        items: weekItems,
        totals,
      });
    }
    
    return trips;
  }, [allItems, days, weekSize]);

  // Overall totals across all weeks
  const totals = useMemo(() => ({
    items: allItems.length,
    grams: allItems.reduce((sum, item) => sum + item.totalGrams, 0),
    purchased: allItems.filter((item) => item.isPurchased).length,
    estimatedCost: allItems.reduce((sum, item) => sum + (item.estimatedCost ?? 0), 0),
  }), [allItems]);

  const togglePurchase = useCallback((foodId: string) => {
    setPurchasedItems((prev) => {
      const now = new Date().toISOString();
      if (prev[foodId]) {
        const rest = { ...prev };
        delete rest[foodId];
        return rest;
      }
      return { ...prev, [foodId]: now };
    });
  }, []);

  const resetPurchases = useCallback(() => setPurchasedItems({}), []);

  const addItem = useCallback((item: Omit<CustomShoppingListItem, 'foodId'>) => {
    const foodId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setCustomItems((prev) => [...prev, { ...item, foodId }]);
  }, []);

  const updateItem = useCallback((foodId: string, updates: Partial<Omit<CustomShoppingListItem, 'foodId'>>) => {
    setCustomItems((prev) =>
      prev.map((item) => (item.foodId === foodId ? { ...item, ...updates } : item))
    );
  }, []);

  const removeItem = useCallback((foodId: string) => {
    setCustomItems((prev) => prev.filter((item) => item.foodId !== foodId));
    setPurchasedItems((prev) => {
      if (!prev[foodId]) return prev;
      const rest = { ...prev };
      delete rest[foodId];
      return rest;
    });
  }, []);

  return {
    items: allItems,
    weeklyTrips,
    purchasedItems,
    totals,
    togglePurchase,
    resetPurchases,
    addItem,
    updateItem,
    removeItem,
  };
}
