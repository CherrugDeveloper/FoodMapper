# FoodMapper

FoodMapper is a modern, responsive React application built with TypeScript, Tailwind CSS v4, and Vite, designed for personalized nutrition planning, metabolic tracking, FODMAP analysis, and dietary management.

## Key Features

- **Personalized Diet Plan**: Multi-phase diet planner with calendar navigation [`DayNavigator.tsx`](src/components/DayNavigator.tsx:1), phase progress tracking [`PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:1), and dynamic meal management [`DietPlan.tsx`](src/components/DietPlan.tsx:1).
- **Nutritional Calculator**: Advanced calculation engine for daily caloric needs, macronutrients, and meal count risk indicators [`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1).
- **Bilingual Food Search**: Comprehensive food database with bilingual search capabilities [`useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1).
- **Sleep & Workout Tracking**: Integrated fitness plans, sleep tracking, sleep sounds, and diary logging [`Diary.tsx`](src/components/Diary.tsx:1), [`WorkoutPlan.tsx`](src/components/WorkoutPlan.tsx:1), [`SleepTracker.tsx`](src/components/SleepTracker.tsx:1).
- **Internationalization**: Full multi-language support (IT, EN, ES, FR, DE) via i18next [`i18n.ts`](src/i18n.ts:1).

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run test suite
npm test

# Build for production
npm run build
```

## License

MIT License
