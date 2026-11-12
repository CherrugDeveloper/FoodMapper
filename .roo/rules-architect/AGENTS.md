# Project Architecture Rules (Non-Obvious Only)

- `navigateRef` pattern in `src/utils/navigation.ts`: module-level getter/setter for React Router's `navigate` function, set in `AppWithProvider`
- `app-navigation` CustomEvent is the bridge between imperative `navigateTo()` calls and React Router navigation
- `DayNavigator` listens for `app-navigation` event to handle date navigation from external components
- DietPlan state is managed in `useDietPlan` hook; `AppContext` wraps it and persists `calcResults`/`userData` to localStorage
- Infinite re-render root cause: `useEffect` in `AppContext.tsx` depended on `dietPlan` identity which changed every render due to `useDietPlan()` being called un-memoized
