# Project Debug Rules (Non-Obvious Only)
- Infinite re-render loop in DietPlan: `useDietPlan()` called during render without `useMemo` causes `regenerateDays()` → `setState` → new `dietPlan` identity → effect re-runs → React freeze → keyboard navigation stops
- i18n raw strings for de/es/fr: bundles never loaded because `preload` option missing from `i18n.init()` config
- `navigateTo()` debug `console.log` statements were removed from `src/utils/navigation.ts` — do not re-add
- `checkTranslationsDirectly()` debug function removed from `src/main.tsx` — do not re-add
- NaN fat values in meal generation: caused by `fats:` (plural) key in `FOODS_DATABASE` vs `fat` (singular) in `FoodNutrition` interface — fixed via `sed -i 's/fats:/fat:/g' src/utils/foodsData.ts`
- NaN in recipe macros: `recipesData.ts` `createPortion()` used `food.nutrition.fats` (plural) — fixed to `food.nutrition.fat`
- Double-scaling bug in `mealGenerator.ts`: `p.nutrition` scaled again with `scale(..., p.grams)` causing NaN when `totals.protein` became 0 — fixed by using `p.nutrition` directly
- `nutritionCalculator.ts` used `totals.totalFat` but interface has `totalFats` (plural) — fixed to `totals.totalFats`