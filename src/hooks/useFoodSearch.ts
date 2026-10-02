import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { FoodItem } from '../utils/foodsData';

interface FoodSearchResult {
  searchFoods: (query: string) => FoodItem[];
}

export const useFoodSearch = (foods: FoodItem[]): FoodSearchResult => {
  const { t } = useTranslation();

  const isFoodNameMatch = (foodName: string, query: string): boolean => {
    return foodName.toLowerCase().includes(query.toLowerCase());
  };

  const searchFoods = useCallback((query: string): FoodItem[] => {
    const normalizedQuery = query.toLowerCase();

    return foods.filter((food) => {
      const rawNameMatch = isFoodNameMatch(food.name, normalizedQuery);
      const translatedName = t(`foods.${food.id}.name`).toLowerCase();
      const translatedMatch = translatedName.includes(normalizedQuery);
      return rawNameMatch || translatedMatch;
    });
  }, [foods, t]);

  return { searchFoods };
};