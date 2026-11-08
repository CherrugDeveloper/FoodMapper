# FoodMapper

FoodMapper is a high-performance Progressive Web Application (PWA) designed for personalized diet planning, nutritional calculation, FODMAP tracking, dietary journaling, sleep monitoring, and fitness integration. Built with React, TypeScript, Tailwind CSS, and Vite.

## Features

- **Personalized Diet Plans**: Customized macro and calorie tracking with meal breakdowns.
- **Bilingual Food Search**: Advanced multi-language food filtering (`useFoodSearch`).
- **Interactive Calendar & Day Navigator**: Timezone-safe date navigation, Italian holidays, saint days, moon phases, and personal note/event/menstrual cycle tracking (`DayNavigator`).
- **Nutritional Calculation Pipeline**: Memoized calculation engine for accurate macro/micronutrient estimation.
- **Sleep & Medication Tracking**: Comprehensive health tracking and notification reminders.
- **PWA & Offline Support**: Fully responsive, installable Progressive Web Application with offline capabilities.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite with PWA plugin
- **Internationalization (i18n)**: `i18next` with HTTP backend loading
- **Testing**: Vitest (unit tests) & Playwright (E2E tests)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

### Testing

Run the Vitest unit test suite:

```bash
npm test
```

Run Playwright E2E tests:

```bash
npm run test:e2e
```

### Production Build

Build for production and generate PWA service worker:

```bash
npm run build
```

## License

MIT License. See [LICENSE](LICENSE) for details.
