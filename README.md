# FoodMapper

## Overview

FoodMapper is a comprehensive nutrition tracking and diet management application designed to help individuals manage their dietary needs, particularly for those with Irritable Bowel Syndrome (IBS). The application provides tools for meal planning, calorie tracking, food filtering, and personalized diet phases.

## Features

- **Diet Plan Management**: Structured meal planning with 4-phase diet approach
- **Nutrition Calculator**: Calorie and macronutrient tracking with EFSA compliance
- **Food Database**: Comprehensive food database with FODMAP filtering
- **Meal Diary**: Track meals, ingredients, and notes
- **Calendar View**: Interactive calendar with phase highlighting and day navigation
- **Multi-language Support**: Italian, English, German, French, and Spanish
- **Progressive Web App**: Installable PWA with offline capabilities
- **Water Reminders**: Notification-based hydration tracking

## Technical Details

- **Version**: 2.12.61
- **Version Date**: 2026-11-10
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks with custom hooks
- **Testing**: Vitest for unit tests, Playwright for E2E tests

## Prerequisites

- Node.js 18.18.0 or higher
- npm 9.0.0 or higher

## Clone and Install

```bash
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Unit Tests

```bash
npm run test:run
```

## E2E Tests

```bash
npm run test:e2e
```

## Project Structure

```
FoodMapper/
├── src/
│   ├── components/           # Reusable UI components
│   ├── context/              # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions and helpers
│   ├── assets/              # Static assets
│   └── i18n.ts              # Internationalization configuration
├── public/                   # Public static files
├── tests/                    # Test files (unit, integration, E2E)
├── CHANGELOG.md             # Version history
└── package.json             # Project configuration
```

## Browser Support

The application supports the latest versions of:
- Chrome (120+)
- Firefox (121+)
- Safari (17+)
- Edge (120+)

## PWA Features

FoodMapper functions as a Progressive Web App with:
- Add to Home Screen capability
- Offline functionality
- Push notifications for water reminders
- Stand-alone mode when installed
- Web manifest with appropriate icons

## Data Storage

Data is stored in browser local storage and includes:
- Diet plan configuration
- Diary entries
- User preferences
- Water intake tracking
- Language preference via i18next

## Reproducibility for Academic Use

For academic or research use, this project supports reproducible computational workflows:

1. **Environment**: Node.js 18.18.0+ with npm 9.0.0+
2. **Dependencies**: Exact versions locked in `package-lock.json`
3. **Tests**: Complete test suite available via `npm run test:run`
4. **Build**: Deterministic builds via `npm run build`
5. **Documentation**: Inline JSDoc comments and TypeScript types
6. **Version Control**: Git tags for each release (`git checkout v2.12.61`)

For publications, please reference:
- Repository: https://github.com/CherrugDeveloper/FoodMapper
- Version: 2.12.61 (2026-11-10)
- DOI: Available via GitHub releases

## Contributing

This project follows the Keep a Changelog format and uses semantic versioning (SemVer 2.0.0).

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript strict mode enabled
- ESLint with React hooks rules
- Prettier for code formatting
- All tests must pass before merging

## Security Considerations

- No sensitive data stored locally
- No third-party analytics
- Environment variables (.env) should never be committed
- Use `.env.example` as template for required environment variables

## License

See LICENSE file for details.

## Acknowledgments

- Monash University FODMAP research
- EFSA dietary guidelines
- React and Vite communities