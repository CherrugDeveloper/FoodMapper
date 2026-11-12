# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-obvious gotchas
- **GitHub Pages Routing**: `vite.config.ts` MUST have `base: './'`. Changing this breaks deep-linking and assets.
- **Disclaimer Persistence**: `localStorage.ibs_disclaimer_accepted` (no prefix) vs `foodmapper_` for other keys.
- **Bilingual Search**: `FoodFilter` and `useFoodSearch` must match both localized names and raw `food.name`.
- **Seasonal Logic**: Foods with `food.months` restricted to IDs 4, 5, 7, 8, 9, 10; others are year-round.
- **Tailwind v4 Spacing**: Use logical properties (`margin-block-*`) for vertical spacing instead of `margin-top/bottom`.
- **Calendar Indexing**: In `DayNavigator.tsx`, always match using `d.dayIndex === currentDayIndex`.
- **Navigation Fallback**: `navigateTo()` dispatches `app-navigation` CustomEvent for React Router v7 compatibility when `navigateRef` is null.

## Event Listener Pattern
- **Cleanup Requirement**: Registered listeners (e.g., `app-navigation`) MUST be inside `useEffect` with a removal return function.
- **Placement**: Registration must happen AFTER all dependent variables/hooks are initialized to avoid block-scope errors (TS2448).
- **Stale Closures**: Use `useRef` for callbacks passed to components that manage their own timers or intervals (e.g., `DayNavigator`).

## Testing Conventions
- **Custom Events in JSDOM**: `window.dispatchEvent` mocks in Vitest must manually trigger target listeners to simulate synchronous behavior in headless environments.
- **Location Mocking**: Use the custom location provider in `tests/navigation.test.ts` to handle `ancestorOrigins` and complex path normalization.
