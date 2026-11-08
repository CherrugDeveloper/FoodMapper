# FoodMapper

FoodMapper is an advanced, multilingual web application built with React, TypeScript, Vite, and Tailwind CSS. It provides personalized FODMAP nutritional planning, diet phasing, sleep tracking, workout management, medication reminders, and a comprehensive interactive calendar planner.

## Features

- **Personalized Diet & Nutrition Planning**: Dynamic meal generation ([[`mealGenerator.ts`](src/utils/mealGenerator.ts:1)]), macro calculation ([[`nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1)]), and structured meal cards ([[`MealCard.tsx`](src/components/dietPlan/MealCard.tsx:1)]).
- **Interactive Calendar & Day Navigator**: Monthly calendar grid ([[`DayNavigator.tsx`](src/components/DayNavigator.tsx:1)]) featuring month navigation controls, daily saints ([[`calendarHelpers.ts`](src/utils/calendarHelpers.ts:32)]), moon phases ([[`calendarHelpers.ts`](src/utils/calendarHelpers.ts:51)]), weekends/holidays, diet phases, and user notes, birthdays, events, and menstrual cycle tracking.
- **Health & Lifestyle Dashboards**: Sleep tracking ([[`SleepTracker.tsx`](src/components/SleepTracker.tsx:1)]), workout planner ([[`WorkoutPlan.tsx`](src/components/WorkoutPlan.tsx:1)]), medication manager ([[`MedicationReminder.tsx`](src/components/MedicationReminder.tsx:1)]), and daily diary ([[`Diary.tsx`](src/components/Diary.tsx:1)]).
- **Multilingual Support**: Internationalization powered by `i18next` with support for English, Italian, French, German, and Spanish ([[`i18n.ts`](src/app.tsx)]).

## Project Structure

- [`src/components/`](src/components/) - React UI components including [`DietPlan.tsx`](src/components/DietPlan.tsx:1), [`DayNavigator.tsx`](src/components/DayNavigator.tsx:1), and [`MealCard.tsx`](src/components/dietPlan/MealCard.tsx:1).
- [`src/hooks/`](src/hooks/) - Custom React hooks such as [`useDietPlan.ts`](src/hooks/useDietPlan.ts:1) and [`useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1).
- [`src/utils/`](src/utils/) - Business logic, diet engine, calendar helpers ([[`calendarHelpers.ts`](src/utils/calendarHelpers.ts:1)]), and storage helpers.
- [`tests/`](tests/) - Comprehensive unit and integration test suites using Vitest and Playwright.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper
npm install
```

### Running Locally

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
