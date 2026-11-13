# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Critical Non-Obvious Gotchas
- `vite.config.ts` MUST have `base: './'` (line 114). Changing it breaks GitHub Pages deep-linking and assets.
- `localStorage.ibs_disclaimer_accepted` uses no prefix; all other `localStorage` keys use `foodmapper_` prefix.
- i18next `HttpBackend` only loads the active language bundle unless `preload: ['it','en','de','es','fr']` is in `src/i18n.ts`.
- `TRANSLATION_VERSION` ('2') in `src/i18n.ts` cache-busts translation bundles; increment when translation files change.
- Tailwind v4: use logical properties (`margin-block-*`) for vertical spacing instead of `margin-top/bottom`.
- `DayNavigator.tsx`: match days using `d.dayIndex === currentDayIndex`, never date string comparison.
- `useDietPlan()` in `src/context/AppContext.tsx` MUST be wrapped in `useMemo(() => useDietPlan(...), [calcResults, userData, dietStartDate])` — un-memoized calls cause infinite re-render via `regenerateDays()` → `setState`.
- `navigateTo()` in `src/utils/navigation.ts` dispatches `app-navigation` CustomEvent as fallback when `navigateRef` is null (React Router v7 compatibility).
- Foods with `food.months` restricted to IDs 4, 5, 7, 8, 9, 10; others are year-round.
- `FoodFilter` / `useFoodSearch` must match both localized names and raw `food.name`.

## Event Listener Pattern
- Registered listeners (e.g., `app-navigation`) MUST be inside `useEffect` with a removal return function.
- Registration must happen AFTER all dependent hooks/variables are initialized (avoids TS2448 block-scope errors).
- Use `useRef` for callbacks passed to components managing their own timers/intervals (e.g., `DayNavigator`).

## Testing Conventions
- Custom Events in JSDOM: `window.dispatchEvent` mocks in Vitest must manually trigger target listeners (headless envs don't propagate synchronously).
- Location mocking: use the custom location provider in `tests/navigation.test.ts` for `ancestorOrigins` and path normalization.
