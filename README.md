# FoodMapper

## Overview
FoodMapper is a progressive web application (PWA) designed to provide personalized nutritional planning, dietary guidance (including FODMAP guidelines), health condition management, biometric calculators, and workout routines.

## Key Features
- **Nutritional Calculator**: Biometric input (weight, height, age, biological sex, activity level, dietary goals) with weight-dependent EFSA caffeine safety calculation.
- **Diet & Meal Planning**: Customized daily meal generator supporting multiple meal counts and dietary restrictions.
- **Health Condition Management**: Condition-specific dietary adjustments (celiac, diabetes types 1 & 2, hypertension, pregnancy, thyroid conditions, menopause, PCOS).
- **Allergen & Medication Warnings**: Comprehensive allergen filtering and medication-food interaction recognition.
- **Multi-language Support**: Fully internationalized (English, Italian, French, German, Spanish) via i18next.

## Project Structure
```
FoodMapper/
├── public/locales/         # Translation files (de, en, es, fr, it)
├── src/
│   ├── components/         # UI components and calculators
│   ├── context/            # React context and state management
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Calculation engines, storage, and helpers
└── tests/                  # Unit and E2E test suites (Vitest & Playwright)
```

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

## Installation
```bash
# Clone repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install
```

## Available Scripts
- `npm run dev`: Start Vite development server
- `npm run build`: Type check (`tsc -b`) and production build (`vite build`)
- `npm test`: Run unit test suite with Vitest
- `npm run lint`: Run ESLint checks

## License
MIT License. See [LICENSE](LICENSE) for details.
