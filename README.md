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

FoodMapper is a React-based Progressive Web App (PWA) designed for individuals managing IBS-friendly diets and trifasic (3-phase) weight loss programs. The application provides tools for meal planning, nutritional tracking, sleep monitoring, and fitness integration with full offline support.

### Core Features

- **Phase-based Diet Planning**: Four-phase diet progression system (Preparazione, Avvio, Consolidamento, Mantenimento)
- **Bilingual Food Database**: Extensive food database with Italian and English (and other language) translations
- **Nutritional Calculator**: EFSA-compliant nutrient calculations with personalized recommendations
- **Dietary Diary**: Daily food entry tracking with macro and micronutrient analysis
- **Recipe Manager**: Create, save, and organize recipes with portion scaling
- **Shopping List**: Auto-generated grocery lists from planned meals
- **Sleep Tracker & Sounds**: Track sleep patterns and access relaxing soundscapes
- **Workout Planner**: Design and track exercise routines
- **Educational Hub**: Scientific articles on nutrition, digestion, and wellness topics
- **Daily Nutrition Analysis**: Real-time calculation of calories, proteins, carbs, fats, and micro-nutrients
- **Interactive Calendar**: Monthly view with day selection, holiday indicators, and phase highlighting
- **Medical Disclaimer System**: Configurable health condition warnings and allergen alerts
- **PWA Support**: Progressive Web App with offline capabilities
- **Responsive Design**: Mobile-first approach with dark/light mode support

### Advanced Features

- **Progressive Web App (PWA)**: Installable with offline caching and standalone mode
- **Internationalized**: Multi-language support (English, Italian, Spanish, French, German)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Calendar Integration**: Monthly calendar view with day selection and metadata tracking
- **PWA Installation Prompt**: Native-like installation experience
- **Local Storage Persistence**: All data stored client-side, no server required
- **Accessibility Features**: Keyboard navigation and screen reader support
- **Meal Generation**: AI-powered meal suggestions based on dietary goals and preferences

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

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm run preview` | Preview the build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test:run` | Run all tests once |
| `npm run test` | Run tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests with Playwright |
| `npm run test:ci` | Run E2E tests in CI mode |

## Project Structure

### Frontend

```
src/
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── utils/               # Utility functions and helpers
└── content/             # Internationalization content files
```

### Styling

- **Tailwind CSS v4**: Utility-first CSS framework with logical spacing
- **Dark/Light Mode**: Built-in theme switching support
- **Responsive Design**: Mobile-first responsive grid system

### State Management

- **React Context**: Global state management via AppContext
- **Custom Hooks**: Reusable state logic in `src/hooks/`
- **Local Storage**: Client-side persistence with fallback mechanisms

### Internationalization

- **i18next**: Industry-standard i18n framework
- **Languages**: English, Italian, Spanish, French, German
- **Content Files**: Located in `src/content/` directory

### Testing

- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **Test Coverage**: 120 tests across 17 test files

## Application Features

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers: Chrome for Android, Safari for iOS

### Core Components

- **DayNavigator**: Interactive calendar-based day selection
- **DietPlan**: Phase-based meal planning interface
- **Diary**: Food entry and tracking
- **NutritionalCalculator**: EFSA-compliant nutrient calculations
- **SleepTracker**: Sleep pattern monitoring
- **WorkoutPlan**: Exercise routine management

## Contributing

This project follows standard Open Source contribution guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amIbis`)
3. Commit your changes (`git commit -m 'feat: add amIbis'`)
4. Push to the branch (`git push origin feature/amIbis`)
5. Open a Pull Request

Please ensure all tests pass before submitting a PR:

```bash
npm run test:run
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Citation & Academic Attribution

If you use FoodMapper in your research or educational program, please cite:

```bibtex
@misc{foodmapper,
  author = {cherrugdeveloper},
  title = {FoodMapper: A Progressive Web App for IBS-friendly Diet Management},
  year = {2026},
  howPublished = {\url{https://github.com/cherrugdeveloper/FoodMapper}},
}