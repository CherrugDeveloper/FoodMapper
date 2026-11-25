# Project Architecture Rules (Non-Obvious Only)
- `navigateRef` pattern in `src/utils/navigation.ts`: module-level getter/setter for React Router's `navigate` function, set in `AppWithProvider`
- `app-navigation` CustomEvent is the bridge between imperative `navigateTo()` calls and React Router navigation
- `DayNavigator` listens for `app-navigation` event to handle date navigation from external components
- DietPlan state is managed in `useDietPlan` hook; `AppContext` wraps it and persists `calcResults`/`userData` to localStorage
- Infinite re-render root cause: `useEffect` in `AppContext.tsx` depended on `dietPlan` identity which changed every render due to `useDietPlan()` being called un-memoized
- `FoodNutrition` interface uses `fat` (singular) — all nutrition objects in `FOODS_DATABASE` must use `fat:` key, not `fats:`
- `NutritionalResults` interface uses `fats` (plural) — `nutritionCalculator.ts` must use `totals.totalFats`
- `mealGenerator.ts` fat portion generation must use `p.nutrition` directly (no re-scaling with `scale()`)