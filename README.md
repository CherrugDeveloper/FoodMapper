# FoodMapper

FoodMapper is a high-performance, bilingual nutritional tracking, diet planning, and health monitoring progressive web application (PWA) built with React, TypeScript, Tailwind CSS, and Vite.

## Features

- **Nutritional Calculator**: Calculate caloric needs and macronutrient distributions using advanced formulas (Mifflin-St Jeor).
- **Diet & Meal Planner**: Dynamic meal generation with phase tracking, food filtering, and seasonal food support.
- **Bilingual Food Search**: Instant bilingual search across localized food databases (`[`src/hooks/useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1)`).
- **Diary & Water Tracker**: Track daily meals, water intake with real notification permissions, and health metrics.
- **Educational Hub**: Markdown-based articles and insights on nutrition, gut health (FODMAP), bio-hacking, and metabolism.
- **Sleep & Workout Trackers**: Comprehensive tools for sleep tracking, ambient sleep sounds, and custom workout routines.
- **PWA & Offline Support**: Fully responsive PWA with offline caching and automatic updates.

## Project Structure

```text
src/
├── components/   # UI components and feature views (DietPlan, Diary, Recipes, etc.)
├── context/      # React context providers and state management
├── hooks/        # Custom hooks (useFoodSearch, useDietPlan, useSleepTracking, etc.)
├── content/      # Markdown educational articles (multi-language)
├── types/        # TypeScript type definitions
├── utils/        # Calculation engines, storage utilities, calendar helpers
└── i18n.ts       # Internationalization configuration (i18next)
```

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/cherrugdeveloper/FoodMapper.git
   cd FoodMapper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Testing & Validation

Run unit tests with Vitest:
```bash
npm test
```

Run end-to-end tests with Playwright:
```bash
npm run test:e2e
```

Build for production:
```bash
npm run build
```

## License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE:1) file for details.
