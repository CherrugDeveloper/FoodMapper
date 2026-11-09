# FoodMapper

A comprehensive diet planning and nutritional tracking web application for managing personalized meal plans, calorie tracking, and health monitoring.

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Application Features](#application-features)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

FoodMapper is a React-based web application that provides a complete dietary management system. The application features:

- **Diet Planning**: Interactive calendar-based meal planning with phase progression
- **Nutritional Tracking**: Calorie and macro nutrient calculation
- **Food Diary**: Daily food entry and tracking
- **Medical Integration**: Health condition and allergen tracking
- **Workout Planning**: Integrated fitness routine management
- **Language Support**: Multilingual interface (English, Italian, German, Spanish, French)

### Core Features

- **Phase-based Diet Planning**: Four-phase diet progression system (Preparazione, Avvio, Consolidamento, Mantenimento)
- **Daily Nutrition Analysis**: Real-time calculation of calories, proteins, carbs, fats, and micro-nutrients
- **Interactive Calendar**: Monthly view with day selection, holiday indicators, and phase highlighting
- **Medical Disclaimer System**: Configurable health condition warnings and allergen alerts
- **PWA Support**: Progressive Web App with offline capabilities
- **Responsive Design**: Mobile-first approach with dark/light mode support

### Advanced Features

- **Meal Generation**: AI-powered meal suggestions based on dietary goals and preferences
- **Shopping List**: Auto-generated grocery lists from planned meals
- **Water Tracking**: Daily hydration goals and reminders
- **Sleep Monitoring**: Sleep duration and quality tracking
- **Exercise Integration**: Workout routine management and tracking
- **Recipe Database**: Comprehensive food database with nutritional information

## Installation

### Prerequisites

- **Node.js**: Version 24.x or higher
- **npm**: Package manager (comes with Node.js)
- **Git**: Version control system

### Recommended Browser

FoodMapper is optimized for modern browsers. The application performs best on:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

For full functionality, enable JavaScript and cookies in your browser settings.

### Clone the repository

```bash
git clone https://github.com/marco/foodmapper.git
cd foodmapper
```

### Install dependencies

```bash
npm install
```

### Environment setup

Before running the application, create a `.env` file in the root directory with the following variables:

```bash
# API endpoint for translation files (if using custom backend)
# VITE_API_URL=https://your-api-endpoint.com

# Optional: Custom i18n backend configuration
# VITE_I18N_BACKEND_URL=https://your-i18n-backend.com
```

For translation files, the application uses the public `/locales/` directory structure:
- `/public/locales/en/translation.json`
- `/public/locales/it/translation.json`
- `/public/locales/de/translation.json`
- `/public/locales/es/translation.json`
- `/public/locales/fr/translation.json`

## Available Scripts

In the project directory, you can run the following scripts:

```bash
npm run dev
```
Runs the development server with hot module reloading at `http://localhost:5173`.

```bash
npm run build
```
Builds the application for production deployment. Output is in the `dist/` folder.

```bash
npm run preview
```
Runs a local production server to preview the build.

```bash
npm run lint
```
Runs ESLint to check for code quality issues.

```bash
npm run test
```
Runs the test watcher in interactive mode.

```bash
npm run test:run
```
Runs all tests once in a non-interactive mode.

```bash
npm run test:e2e
```
Runs Playwright end-to-end tests.

```bash
npm run test:e2e:ui
```
Runs Playwright tests in interactive UI mode.

```bash
npm run test:ci
```
Runs Playwright tests in CI mode with line reporter.

### Preview the build locally

After running `npm run build`, you can preview the production build:

```bash
npm run preview
```

This is the best way to test your production build locally before deploying.

### Run all tests

To run all unit and integration tests:

```bash
npm run test:run
```

For end-to-end tests:

```bash
npm run test:e2e
```

## Project Structure

### Frontend

The application follows a modular component architecture:

```
src/
├── App.tsx                          # Main application entry point
├── main.tsx                         # React bootstrapping
├── index.css                        # Global styles
├── i18n.ts                          # Internationalization configuration
├── assets/                          # Static assets (images, icons)
├── components/                      # Reusable UI components
│   ├── Header.tsx                   # Application header
│   ├── Diary.tsx                    # Food diary component
│   ├── DietPlan.tsx                 # Diet planning calendar
│   ├── NutritionalCalculator.tsx    # Nutrition input and calculation
│   ├── DayNavigator.tsx             # Calendar navigation
│   ├── Toast.tsx                    # Notification system
│   └── ...                          # Other components
├── components/dietPlan/             # Diet plan sub-components
│   ├── DaySummary.tsx
│   ├── MealCard.tsx
│   └── PhaseProgress.tsx
├── context/                         # React context providers
│   └── AppContext.tsx               # Global state management
├── hooks/                           # Custom React hooks
│   ├── useDietPlan.ts
│   ├── useToast.ts
│   └── ...                          # Other hooks
├── types/                           # TypeScript type definitions
│   └── dietPlan.ts
└── utils/                           # Utility functions
    ├── nutritionCalculator.ts       # Nutrition computation logic
    └── ...
```

### Styling

The project uses Tailwind CSS v4 with CSS variables for theming:

```css
/* src/index.css */
:root {
  --text: #0f172a;
  --bg: #ffffff;
  --border: #e2e8f0;
}

[data-theme="dark"] {
  --text: #f1f5f9;
  --bg: #0f172a;
  --border: #1e293b;
}
```

### State Management

Global state is managed through React Context (`AppContext.tsx`) with the following key slices:

- `dietStartDate`: Start date of the diet plan
- `userPreferences`: User settings (goal, gender, weight, etc.)
- `state`: Current day's diet plan
- `recentDays`: Diary entries for the last 7 days

### Internationalization

The application supports multiple languages via `react-i18next`:

- **Language Detection Order**: localStorage > cookie > navigator
- **Fallback Language**: English
- **Translation Files**: Located in `public/locales/` directory

### Testing

The project uses a multi-layered testing approach:

- **Unit Tests**: Vitest + React Testing Library for component and hook testing
- **Integration Tests**: Component interaction tests
- **E2E Tests**: Playwright for full application flow testing

Test directories:
```
tests/
├── *.test.ts(x)              # Unit and integration tests
├── e2e/                       # Playwright end-to-end tests
└── __mocks__/                 # Mock implementations
```

## Deployment

### Deployment steps

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider:
   - Vercel, Netlify, or any static file host
   - GitHub Pages (configure via GitHub Actions)

3. For GitHub Pages deployment, ensure:
   - `vite.config.ts` has `base: './'` for relative pathing
   - Deploy workflow is configured in `.github/workflows/`

### Docker Deployment (Optional)

```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## Application Features

### Key Components

#### DietPlan Component
The `DietPlan.tsx` component provides:
- Monthly calendar view with phase highlighting
- Day selection and navigation
- Phase progress tracking
- Meal count modification buttons
- Link to recipe details

#### Diary Component
The `Diary.tsx` component includes:
- Daily food entry forms
- Meal field management (breakfast, lunch, dinner, snacks)
- Water intake tracking
- Symptom logging
- Nutritional analysis display

#### NutritionalCalculator Component
The `NutritionalCalculator.tsx` component offers:
- User input form for BMI calculation
- Health condition selection
- Allergen preference management
- Medication tracking
- Nutritional recommendations

## Contributing

We welcome contributions to FoodMapper! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass (`npm run test:run`)
- Code follows the project's linting rules (`npm run lint`)
- New features include appropriate tests

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Citation & Academic Attribution

If you use FoodMapper in academic research, please cite:

```bibtex
@misc{foodmapper2024,
  author = {Marco},
  title = {FoodMapper: A Comprehensive Diet Planning and Nutritional Tracking Application},
  year = {2024},
  publisher = {GitHub},
  version = {2.12.58},
  url = {https://github.com/marco/foodmapper}
}
```

### Research Support

FoodMapper is designed to support nutritional research and personalized diet planning. Key research features include:

- **FAO/EFSA Nutritional Guidelines**: Integration with recommended daily intakes
- **Macro-Nutrient Distribution**: Protein, carbohydrate, and fat targets based on dietary goals
- **Micro-Nutrient Tracking**: Vitamins and minerals per RDA
- **FODMAP Monitoring**: For digestive health management

---

© 2024 FoodMapper. All rights reserved.