# Project Debug Rules (Non-Obvious Only)

- Infinite re-render loop in DietPlan: `useDietPlan()` called during render without `useMemo` causes `regenerateDays()` → `setState` → new `dietPlan` identity → effect re-runs → React freeze → keyboard navigation stops
- i18n raw strings for de/es/fr: bundles never loaded because `preload` option missing from `i18n.init()` config
- `navigateTo()` debug `console.log` statements were removed from `src/utils/navigation.ts` — do not re-add
- `checkTranslationsDirectly()` debug function removed from `src/main.tsx` — do not re-add
