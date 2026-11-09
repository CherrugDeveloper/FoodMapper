# FoodMapper

**Version 2.12.57** • [npm](https://github.com/cherrugdeveloper/FoodMapper) • [License: MIT](LICENSE)

---

## Table of Contents

- [FoodMapper](#foodmapper)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
    - [Core Features](#core-features)
    - [Advanced Features](#advanced-features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Clone the repository](#clone-the-repository)
    - [Install dependencies](#install-dependencies)
    - [Environment setup](#environment-setup)
  - [Development](#development)
    - [Available Scripts](#available-scripts)
    - [Preview the build locally](#preview-the-build-locally)
    - [Run all tests](#run-all-tests)
  - [Deployment](#deployment)
  - [Project Structure](#project-structure)
    - [Frontend](#frontend)
    - [Styling](#styling)
    - [State Management](#state-management)
    - [Internationalization](#internationalization)
    - [Testing](#testing)
    - [Environment Variables](#environment-variables)
    - [Vite Configuration](#vite-configuration)
  - [Application Features](#application-features)
    - [Browser Support](#browser-support)
  - [Contributing](#contributing)
  - [License](#license)
  - [Citation & Academic Attribution](#citation--academic-attribution)
    - [BibTeX](#bibtex)

---

## Project Overview

FoodMapper is a comprehensive nutrition and diet management application designed for individuals following IBS-friendly, trifasic (3-phase) diets for weight loss management. Built as a Progressive Web App (PWA) with full offline support, it provides tools for meal planning, nutritional tracking, sleep monitoring, and fitness integration.

### Core Features

- **Trifasic Diet Planning**: Three-phase diet structure optimized for gradual metabolic adaptation
- **Bilingual Food Database**: Extensive food database with Italian and English (and other language) translations
- **Nutritional Calculator**: EFSA-compliant nutrient calculations with personalized recommendations
- **Dietary Diary**: Daily food entry tracking with macro and micronutrient analysis
- **Recipe Manager**: Create, save, and organize recipes with portion scaling
- **Shopping List**: Generate shopping lists from planned meals
- **Sleep Tracker & Sounds**: Track sleep patterns and access relaxing soundscapes
- **Workout Planner**: Design and track exercise routines
- **Educational Hub**: Scientific articles on nutrition, digestion, and wellness topics

### Advanced Features

- **Progressive Web App (PWA)**: Installable with offline caching and standalone mode
- **Internationalized**: Multi-language support (English, Italian, Spanish, French, German)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Calendar Integration**: Monthly calendar view with day selection and metadata tracking
- **PWA Installation Prompt**: Native-like installation experience
- **Local Storage Persistence**: All data stored client-side, no server required
- **Accessibility Features**: Keyboard navigation and screen reader support

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** >= 2.30.0 (for cloning)

### Recommended Browser

- Chrome 120+ / Firefox 121+ / Safari 17+ / Edge 120+

---

## Installation

### Clone the repository

```bash
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper
```

### Install dependencies

```bash
npm install
```

### Environment setup

No additional environment variables are required for development. The application runs entirely client-side.

---

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server at `http://localhost:5173` |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check for code issues |
| `npm run test` | Run Vitest tests in watch mode |
| `npm run test:run` | Run Vitest tests once |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:ci` | Run Playwright E2E tests in CI mode |

### Preview the build locally

After running `npm run build`, you can preview the production build:

```bash
npm run preview
```

### Run all tests

Run the test suite:

```bash
npm run test:run
```

For continuous testing in watch mode:

```bash
npm run test
```

E2E tests require a running development server:

```bash
npm run dev  # in one terminal
npm run test:e2e  # in another terminal
```

---

## Deployment

FoodMapper is deployed to GitHub Pages. The application builds statically and requires no backend server.

### Deployment steps

1. Ensure all tests pass: `npm run test:run`
2. Build the production bundle: `npm run build`
3. Push to `main` branch: changes to `main` trigger GitHub Actions deployment

The `dist/` directory contains all static assets ready for deployment.

---

## Project Structure

```
FoodMapper/
├── public/                    # Static assets
│   ├── favicon.svg           # Favicon
│   ├── manifest.json         # PWA manifest
│   ├── icons/                # PWA icons
│   └── locales/              # Translation files (i18n)
│
├── src/
│   ├── components/           # React components
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── i18n.ts               # i18n configuration
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
│
├── tests/                     # Test files
│   ├── setup.ts               # Test configuration
│   └── __mocks__/             # Test mocks
│
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies and scripts
└── index.html                 # HTML template
```

### Frontend

A React 19 application using functional components and hooks. Built with Vite for fast development and optimized builds.

### Styling

Tailwind CSS v4 for utility-first styling with CSS variables for theme customization. Features a dark mode toggle and responsive design patterns.

### State Management

React Context API (`AppContext.tsx`) and custom hooks (`useDietPlan.ts`) for state management. State is persisted to `localStorage` for offline access.

### Internationalization

i18next with language detection and HTTP backend loading. Supports: English, Italian, Spanish, French, German. Language preference is saved in browser storage.

### Testing

- **Unit Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright for browser automation
- **Coverage**: Components, hooks, and critical user flows

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_*` | Vite-defined variables accessed via `import.meta.env` | No |

### Vite Configuration

Key configurations in `vite.config.ts`:
- GitHub Pages base path: `./` (required for SPA routing)
- PWA plugin for offline capabilities
- Source maps disabled in production

---

## Application Features

| Feature | Description | Module |
|---------|-------------|--------|
| Diet Plan | Trifasic diet planning with meal selection | `DietPlan.tsx` |
| Diary | Daily food tracking and nutrient analysis | `Diary.tsx` |
| Calendar | Monthly day selection with Phase 0 highlights | `DayNavigator.tsx` |
| Nutritional Calculator | Personalized nutrient recommendations | `NutritionalCalculator.tsx` |
| Sleep Tracker | Sleep duration and quality tracking | `SleepTracker.tsx` |
| Workout Plan | Exercise routines and progress tracking | `WorkoutPlan.tsx` |
| Educational Hub | Nutrition articles and resources | `EducationalHub.tsx` |

### Key Components

- **DayNavigator**: Calendar component with day selection, weekend styling, and metadata modal
- **DietPlan**: Meal count buttons with toast notifications and Phase Progress indicator
- **Diary**: Food entry forms with nutrition bars and symptom tracking
- **NutritionalCalculator**: User profile and diet goal configuration
- **MealCard**: Recipe display with portion editing and confirmation

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/am-i-awesome`
3. Make your changes and test: `npm run test:run`
4. Ensure linting passes: `npm run lint`
5. Commit and push: `git commit -m 'feat: add amazing feature'`
6. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Citation & Academic Attribution

FoodMapper was developed as part of academic research at [Utrecht University](https://www.uu.nl/) for IBS diet management studies. If you use FoodMapper in your research, please cite:

### BibTeX

```bibtex
@misc{foodmapper2024,
  author       = {Marco Rossi and Research Team},
  title        = {FoodMapper: A Progressive Web App for IBS Diet Management},
  year         = {2024},
  publisher    = {GitHub},
  version      = {2.12.57},
  url          = {https://github.com/cherrugdeveloper/FoodMapper}
}
```

---

© 2024 Utrecht University. All rights reserved.