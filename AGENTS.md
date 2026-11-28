# AGENTS.md

This file provides guidance to agents when working with FoodMapper codebase.

## Critical Non-Obvious Gotchas
- `vite.config.ts` MUST have `base: '/FoodMapper/'` (line 114). Using relative `./` breaks GitHub Pages deep-linking and assets on F5 refresh.
- `localStorage.ibs_disclaimer_accepted` uses no prefix; all other `localStorage` keys use `foodmapper_` prefix.
- i18next `HttpBackend` only loads the active language bundle unless `preload: ['it','en','de','es','fr']` is added to `src/i18n.ts`.
- `TRANSLATION_VERSION` ('2') in `src/i18n.ts` cache-busts translation bundles; increment when translation files change.
- Tailwind v4: use logical properties (`margin-block-*`) for vertical spacing instead of `margin-top/bottom`.
- `DayNavigator.tsx`: match days using `d.dayIndex === currentDayIndex`, never date string comparison.
- `useDietPlan()` in `src/context/AppContext.tsx` MUST be wrapped in `useMemo(() => useDietPlan(...), [calcResults, userData, dietStartDate])` — un-memoized calls cause infinite re-render via `regenerateDays()` → `setState` → new `dietPlan` identity.
- `navigateTo()` in `src/utils/navigation.ts` dispatches `app-navigation` CustomEvent as fallback when `navigateRef` is null (React Router v7 compatibility).
- Foods with `food.months` restricted to IDs 4, 5, 7, 8, 9, 10; others are year-round.
- `FoodFilter` / `useFoodSearch` must match both localized names and raw `food.name`.
- `FoodNutrition` interface uses `fat` (singular) but `FOODS_DATABASE` nutrition objects used `fats:` (plural) — causes NaN in fat calculations. Fixed via `sed -i 's/fats:/fat:/g' src/utils/foodsData.ts`.
- `FoodNutrition.sugar` is declared optional (`sugar?: number`) yet `tsc` strict mode requires it on every `FOODS_DATABASE` nutrition object — always include `sugar` (grams) to avoid TypeCheck errors.
- `recipesData.ts` `createPortion()` used `food.nutrition.fats` (plural) — same NaN bug. Fixed to `food.nutrition.fat`.
- `mealGenerator.ts` double-scaling bug: `p.nutrition` was scaled again with `scale(..., p.grams)` causing NaN when `totals.protein` was 0. Fixed by using `p.nutrition` directly.
- `nutritionCalculator.ts` used `totals.totalFat` but interface has `totalFats` (plural). Fixed to `totals.totalFats`.
- Breakfast fat pool filtering: `getMealPool('fat', 'colazione', ...)` filters by `mealSuitability` including 'breakfast' — olives (72), walnuts (68), tahina (83) are valid breakfast fats.

### New Food IDs Added
- **ID 43**: Sciroppo d'acero - added to FOODS_DATABASE referenced by recipesData.ts
- **ID 44**: Zenzero fresco - added to FOODS_DATABASE referenced by recipesData.ts
- **ID 60**: Curcuma in polvere - added to FOODS_DATABASE referenced by recipesData.ts
- **ID 65**: Acqua minerale - added to FOODS_DATABASE referenced by recipesData.ts
- **ID 66**: Latte di avena - added to FOODS_DATABASE referenced by recipesData.ts

### Portion Size Threshold
- **IRRELEVANT_THRESHOLD_GRAMS = 5**: Minimum portion size in grams; portions < 5g are considered zero/irrelevant
- **Olio di Sesamo (ID 83)**: Fixed unit from 4.5g to 5g cucchiaino to meet threshold

### Meal Suitability Filtering
- **Olio EVO (ID 37)**: Changed mealSuitability from 'any' to 'lunch_dinner' to prevent EVO oil appearing in breakfast meals

### Unit Type Support
- **cucchiaini unit**: Added 'cucchiaini' unit type for precise oil/spice measurements in mealCopyFormatter.ts and FoodUnit type in dietPlan.ts
- **Olio di Sesamo (ID 83)**: Unit type changed from 'cucchiai' to 'cucchiaini' (~4.5-5g per cucchiaino)

### Food Separation
- **Mais fresco (ID 96) vs Polenta di mais (ID 97)**: Separated as distinct foods with proper categorization; mealGenerator updated to distinguish 'mais fresco' from 'polenta di mais' in name matching

### Temp Recipe Pattern
- `MealCard.tsx` generates virtual recipes from meal portions and stores them in `localStorage` as `foodmapper_temp_recipe_temp-{timestamp}`
- `Recipes.tsx` and `RecipeDetail.tsx` must check for `temp-` prefixed IDs and load from `localStorage` instead of `RECIPES_DATABASE`
- Temp recipes are cleaned up when navigating back via `handleBackToMeal` in `RecipeDetail.tsx`

### Event Listener Rules
- Registered listeners (e.g., `app-navigation`) MUST be inside `useEffect` with a removal return function.
- Registration must happen AFTER all dependent hooks/variables are initialized (avoids TS2448 block-scope errors).
- Use `useRef` for callbacks passed to components managing their own timers/intervals (e.g., `DayNavigator`).

## Testing Conventions
- Custom Events in JSDOM: `window.dispatchEvent` mocks in Vitest must manually trigger target listeners (headless envs don't propagate synchronously).
- Location mocking: use the custom location provider in `tests/navigation.test.ts` for `ancestorOrigins` and path normalization.
- Test files must be in same directory as source for vitest to work (not in separate test folder).