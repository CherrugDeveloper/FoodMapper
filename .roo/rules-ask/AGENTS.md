# IBS Nutrition App - Documentation-Specific Rules

## What to reference first when answering questions
- Root gotchas live in [`AGENTS.md`](./AGENTS.md:1).
- Translation source of truth: `public/locales/{it,en}/translation.json` (Italian primary, English fallback).
- Food data & seasonality: `src/utils/foodsData.ts` and the `food.months` contract.
- Search behavior: document bilingual filtering in `FoodFilter` (translated `foods.{id}.name` + raw `food.name`).
- Disclaimer flow: document the acceptance gate (`localStorage.ibs_disclaimer_accepted` string `true`) and that its language selector must render before Header.

## New patterns added
- Added memoization to nutritional calculation pipeline in `src/utils/nutritionCalculator.ts`
- Implemented `useFoodSearch` hook for bilingual food search in `src/hooks/useFoodSearch.ts`
- Updated disclaimer storage with expiration and type validation in `src/utils/storage.ts`
- Created comprehensive notification permission handling in `src/hooks/useNotificationPermission.ts`
