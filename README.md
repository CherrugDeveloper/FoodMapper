# FoodMapper

A web application for IBS (Irritable Bowel Syndrome) nutrition management and meal planning.

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

## Technical Details

- **Version**: 2.12.60
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks with custom hooks

## Installation

### Prerequisites

- Node.js 18.18.0 or higher
- npm 9.0.0 or higher

### Clone and Install

```bash
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

### Unit Tests

```bash
npm run test:run
```

### E2E Tests

```bash
npm run test:e2e
```

## Project Structure

```
FoodMapper/
├── src/
│   ├── components/           # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions and helpers
│   └── assets/              # Static assets
├── public/                  # Public static files
├── tests/                   # Test files
└── package.json            # Project configuration
```

## Browser Support

The application supports the latest versions of:
- Chrome
- Firefox
- Safari
- Edge

## PWA Features

FoodMapper functions as a Progressive Web App with:
- Add to Home Screen capability
- Offline functionality
- Push notifications for water reminders
- Stand-alone mode when installed

## Data Storage

Data is stored in browser local storage and includes:
- Diet plan configuration
- Diary entries
- User preferences
- Water intake tracking

## Contributing

This project follows the Keep a Changelog format and uses semantic versioning.

## License

See LICENSE file for details.

## For Academic Use

For academic use in publications, please reference the project repository and include the version number used in your study.