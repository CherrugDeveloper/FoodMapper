# IBS Nutrition App

## Version
### v2.12.31 (2026-11-07) - Minor Release

## Features
- **Nutritional & Health Calculator**: Personalized macronutrient, micro-nutrient, and calorie calculations based on user profile, health conditions, and allergies with formatted InfoPopups and rounded hot beverage counts.
- **Diet Plan Dashboard**: Phase and day tracking with [`PhaseProgress`](src/components/dietPlan/PhaseProgress.tsx:41), meal confirmation handlers in [`MealCard`](src/components/dietPlan/MealCard.tsx:177), day completion actions, and seamless navigation to recipes (`/recipes`) and shopping list (`/shopping`).
- **Diary & Quick Summary**: Daily food logging, symptom tracking, transit scores, medication reminders, water intake, and percentage calculations without arbitrary capping.
- **Interactive Calendar**: [`DayNavigator`](src/components/DayNavigator.tsx) with saint/moon phases, phase background tinting, weekend styling, and click-outside modal dismissal for notes and reminders.
- **Recipes & Shopping List**: Comprehensive recipe database with ingredient compatibility checks and weekly shopping trip organization.

## Prerequisites
- Node.js >= 18.x
- npm >= 9.x

## Setup
```bash
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper
npm install
```

## Running the Application
```bash
# Development server
npm run dev

# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

## Key Hooks & Utilities
- [`useDietPlan`](src/hooks/useDietPlan.ts): Manages diet days, negative offsets, meal confirmation, portion modification, and completion status.
- [`useFoodSearch`](src/hooks/useFoodSearch.ts): Bilingual food search.
- [`nutritionCalculator`](src/utils/nutritionCalculator.ts): Core nutritional metrics calculation with memoization.

## Contributing
Please follow semantic versioning and ensure all tests pass (`npm test`) before submitting pull requests.

## License
MIT
