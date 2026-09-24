import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DayPlan, ShoppingListItem } from '../types/dietPlan';
import { FOODS_DATABASE } from '../utils/foodsData';

const SHOPPING_STORAGE_KEY = 'ibs-diet-plan-shopping';

export interface UseShoppingListOptions {
  days?: DayPlan[];
  startDate?: string;
  endDate?: string;
}

export function useShoppingList(options: UseShoppingListOptions = {}) {
  const { days = [] } = options;
  void options;

  const [purchasedItems, setPurchasedItems] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(SHOPPING_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(purchasedItems));
    } catch {
      // Storage may be full or unavailable; the in-memory state remains functional.
    }
  }, [purchasedItems]);

  const items = useMemo(() => {
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

  const totals = useMemo(() => ({
    items: items.length,
    grams: items.reduce((sum, item) => sum + item.totalGrams, 0),
    purchased: items.filter((item) => item.isPurchased).length,
  }), [items]);

  return {
    items,
    purchasedItems,
    totals,
    togglePurchase,
    resetPurchases,
  };
}
