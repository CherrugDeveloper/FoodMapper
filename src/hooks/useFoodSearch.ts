import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Food } from '../utils/foodsData';

interface FoodSearchResult {
  searchFoods: (query: string) => Food[];
}

export const useFoodSearch = (foods: Food[]): FoodSearchResult => {
  const { t } = useTranslation();

  const isFoodNameMatch = (foodName: string, query: string): boolean => {
    return foodName.toLowerCase().includes(query.toLowerCase());
  };

  const searchFoods = useCallback((query: string): Food[] => {
    const normalizedQuery = query.toLowerCase();
    const translatedNames = useMemo(() => {
      const names: Record<string, string> = {};
      foods.forEach((food) => {
        names[food.id] = t(`foods.${food.id}.name`);
      });
      return names;
    }, [foods, t]);

    return foods.filter((food) => {
      const rawNameMatch = isFoodNameMatch(food.name, normalizedQuery);
      const translatedMatch = translatedNames[food.id]?.toLowerCase().includes(normalizedQuery);
      return rawNameMatch || translatedMatch;
    });
  }, [foods, t]);

  return { searchFoods };
};