# FoodMapper

A FODMAP-friendly diet planning application for managing IBS and digestive health through personalized meal planning.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Changelog](#changelog)

## Overview

FoodMapper is a web application designed to help individuals following a Low FODMAP diet create and manage personalized meal plans. The application provides intelligent food selection, nutritional calculations, and diet phase management for IBS sufferers.

### Key Capabilities

- **Personalized Meal Generation**: Creates daily meal plans based on individual nutritional needs, allergens, and dietary preferences
- **FODMAP Diet Support**: Implements Monash University FODMAP guidelines for safe food selection
- **Diet Phases**: Supports elimination, reintroduction, and customization phases with proper food rotation
- **Nutritional Tracking**: Calculates calories, macros, and micronutrients for each meal
- **Multi-language Support**: Available in Italian, English, German, French, and Spanish

## Features

### Current Release (v2.12.166)

- **Fixed Semi di Chia display**: Whole-unit foods now show minimum 1 unit instead of "0 cucchiai" when portion is below threshold
- **Enhanced unit guards**: All special unit displays protected against zero-count output

### Previous Release (v2.12.164)

- **Expanded Protein Options**: Added separate entries for Petto di Pollo (ID 33) and Petto di Tacchino (ID 100) for more precise meal planning
- **Enhanced Fat Pool**: Updated breakfast fat options with omega-3 rich foods (walnuts, olives, tahina)
- **Improved Meal Suitability**: Riso Bianco and Riso Integrale now suitable for breakfast
- **Optimized SNACK_CARB_POOL**: Better seasonal availability with Lamponi and Riso Integrale
- **Added 5 missing food items**: Sciroppo d'acero (ID 43), Zenzero fresco (ID 44), Curcuma in polvere (ID 60), Acqua minerale (ID 65), Latte di avena (ID 66) - referenced by recipesData.ts
- **Added cucchiaini unit**: Support for precise oil/spice measurements in meal copy formatting

### Previous Features

- Multi-phase diet support (Elimination, Reintroduction, Customization)
- Food database with 100+ FODMAP-compliant items
- Meal filtering by FODMAP level, allergens, and suitability
- Copy-paste friendly meal formatting
- Responsive design for all devices

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 + React Router 7 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | React Context + Hooks |
| **Internationalization** | react-i18next 17 |
| **Date Handling** | Native JavaScript Date API |
| **Testing** | Vitest, React Testing Library, Playwright |
| **CI/CD** | GitHub Actions, GitHub Pages |

## Installation

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm 10+ or pnpm/yarn (via npm overrides)

### Setup

```bash
# Clone the repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts Vite development server with HMR |
| `npm run build` | Type-checks and builds production bundle |
| `npm run lint` | Runs ESLint code analysis |
| `npm run preview` | Preview production build locally |
| `npm run test` | Starts Vitest test runner in watch mode |
| `npm run test:run` | Runs all tests once (CI) |
| `npm run test:e2e` | Runs Playwright end-to-end tests |
| `npm run test:ci` | Runs e2e tests in CI mode |

### Database Structure

The application uses a structured food database (`src/utils/foodsData.ts`) with entries containing:
- FODMAP classification level
- Nutritional information per 100g
- Seasonal availability (months)
- Meal suitability ratings
- Allergen identification

## Building

```bash
# Production build
npm run build

# Output location
dist/
```

**Note**: Do not modify `vite.config.ts` line 114 (`base: './'`) as this is required for GitHub Pages deep-linking.

## Testing

The project maintains comprehensive test coverage across 19 test files with 163+ tests:

```bash
# Run unit tests
npm run test:run

# Run end-to-end tests
npm run test:e2e
```

### Test Coverage Areas

- Meal generation logic
- Zero-portion filtering
- Seasonal food availability
- FODMAP compliance
- Nutrition calculations
- Phase transitions
- Allergen handling

## Project Structure

```
FoodMapper/
├── public/              # Static assets and locales
├── src/
│   ├── components/      # React components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and data
│   ├── App.tsx          # Main application
│   └── main.tsx         # Entry point
├── tests/               # Test files (co-located with source)
└── vite.config.ts       # Vite configuration
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes grouped by version.

## Contributing

1. Run `npm run lint` before committing
2. Ensure all tests pass: `npm run test:run`
3. Build must succeed: `npm run build`
4. Follow the project's TypeScript strict mode requirements

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For issues and feature requests, please open a GitHub issue.