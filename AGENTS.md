# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-obvious gotchas
- GitHub Pages base: in `vite.config.ts` the `base: './'` value is REQUIRED; changing it breaks routing.
- Disclaimer gate: `localStorage.ibs_disclaimer_accepted` is the only acceptance key and has NO `foodmapper_` prefix; value is the string `true`.
- Storage prefix inconsistency: most persistence keys use `foodmapper_`, but the disclaimer does not.
- i18n persistence: do not override `localStorage.i18nextLng`; language selection is managed by i18next.
- FoodFilter search is bilingual by design: it must match both translated names and raw `food.name`.
- Seasonal foods are limited to IDs 4, 5, 7, 8, 9, 10 using the `food.months` array; no-month foods are year-round.
- Tailwind v4 uses logical spacing: `space-y-*` maps to `margin-block-*` (not `margin-top/bottom`).
- Debugging: Water reminder uses real `Notification.requestPermission()` and must handle denied/unsupported browser states.
