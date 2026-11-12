# Project Coding Rules (Non-Obvious Only)

- `useDietPlan()` in `src/context/AppContext.tsx` MUST be wrapped in `useMemo(() => useDietPlan(...), [calcResults, userData, dietStartDate])` — calling it directly during render causes infinite re-render via `regenerateDays()` → `setState` → new `dietPlan` identity
- `navigateTo()` in `src/utils/navigation.ts` dispatches `app-navigation` CustomEvent as fallback when `navigateRef` is null (React Router v7 compatibility)
- i18next `HttpBackend` only loads the active language bundle unless `preload: ['it', 'en', 'de', 'es', 'fr']` is added to `src/i18n.ts`
- `localStorage.ibs_disclaimer_accepted` uses no prefix; all other `localStorage` keys use `foodmapper_` prefix
- Tailwind v4: use logical properties (`margin-block-*`) for vertical spacing instead of `margin-top/bottom`
- `DayNavigator.tsx`: calendar day matching must use `d.dayIndex === currentDayIndex`, never date string comparison
