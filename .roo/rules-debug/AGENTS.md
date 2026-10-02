# IBS Nutrition App - Debugging-Specific Rules

## High-signal debug checklists
- Disclaimer loop: verify `localStorage.ibs_disclaimer_accepted` exists and equals the string `true` (not boolean).
- i18n persistence: do not override `localStorage.i18nextLng`; if language doesn’t persist, the bug is usually i18next init/preload order.
- Seasonal month bugs: confirm the month array source is `food.months` and that month numbers are 1-12.
- Search mismatches: verify `FoodFilter` searches both translated name and raw `food.name` (case-insensitive); removing either side breaks expected results.
- Notification issues: check `Notification` existence before requesting permission; the reminder must gracefully handle denied/unsupported browsers.

## New patterns added
- Added memoization to nutritional calculation pipeline in `src/utils/nutritionCalculator.ts`
- Implemented `useFoodSearch` hook for bilingual food search in `src/hooks/useFoodSearch.ts`
- Updated disclaimer storage with expiration and type validation in `src/utils/storage.ts`
- Created comprehensive notification permission handling in `src/hooks/useNotificationPermission.ts`
