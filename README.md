# FoodMapper

A comprehensive IBS nutrition guide and diet management application with full PWA support.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Configuration](#configuration)
- [Usage](#usage)

## Project Overview

FoodMapper is a web-based application designed to help individuals manage their Irritable Bowel Syndrome (IBS) through personalized nutrition planning. The application provides a comprehensive suite of tools including a trifasic diet plan, bilingual food database, recipe manager, shopping list, sleep tracker, and workout planner.

## Features

### Core Features
- **IBS Nutrition Guide**: Evidence-based nutritional guidance for IBS management
- **Trifasic Diet Planning**: Three-phase diet plan with structured meal planning
- **Bilingual Food Database**: Multi-language support with FODMAP-aware food filtering
- **Recipe Manager**: Create, edit, and manage personalized recipes
- **Shopping List**: Generate and manage shopping lists based on diet plans
- **Sleep Tracker**: Monitor sleep patterns and receive personalized advice
- **Workout Planner**: Create and track exercise routines

### Advanced Features
- **Progressive Web App (PWA)**: Full offline support with install capability
- **Multi-language Support**: Italian, English, German, Spanish, and French
- **Calendar Integration**: Interactive day navigation with event tracking
- **Nutritional Calculator**: Detailed macronutrient and micronutrient calculations
- **Educational Hub**: Comprehensive nutrition and wellness content

## Installation

### Prerequisites
- Node.js.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev

# Open in browser
# Navigate to http://localhost:5173
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:e2e` | Run end-to-end tests |

## Building

```bash
# Build for production
npm run build

# The output will be in the `dist` directory
# Preview the build locally
npm run preview
```

## Testing

```bash
# Run unit tests
npm run test:run

# Run end-to-end tests
npm run test:e2e

# Run all tests
npm test
```

## Deployment

This project is configured for deployment on GitHub Pages. The build output will be automatically deployed via GitHub Actions CI/CD pipeline.

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
# The `dist` directory contains the production build
```

## Project Structure

```
FoodMapper/
├── public/                    # Static assets
│   ├── index.html            # Entry HTML file
│   └── 404.html              # SPA fallback page
├── src/                      # Source code
│   ├── components/           # React components
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── content/              # Localized educational content
│   ├── i18n.ts               # Internationalization config
│   └── main.tsx              # Application entry point
├── tests/                    # Test files
│   ├── e2e/                  # End-to-end tests
│   └── __mocks__/            # Test mocks
├── .github/                  # GitHub Actions workflows
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies and scripts
```

## Technology Stack

### Frontend
- **React 19**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **React Router**: Client-side routing

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **PWA Support**: Service worker and manifest configuration

### State Management
- **React Context**: State management via custom hooks

### Internationalization
- **i18next**: Internationalization framework
- **i18next-browser-languagedetector**: Language detection
- **i18next-http-backend**: Translation file loading

### Testing
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing
- **Testing Library**: React testing utilities

## Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_KEY` | API key for external services (if needed) |

### Vite Configuration

The project is configured for GitHub Pages deployment with:
- Base path: `./` (relative paths)
- History API fallback for SPA routing
- Source maps for development

## Usage

### Running Locally

1. Clone and install dependencies
2. Run `npm run dev`
3. Open `http://localhost:5173` in your browser

### Building for Production

```bash
npm run build
# Output in dist/ directory
```

### Installing as PWA

1. Open the application in a modern browser
2. Click the install button or use browser's install prompt
3. The app will be available offline after installation

## License

This project is licensed under the terms specified in the LICENSE file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## Support

For issues, questions, or feature requests, please open an issue in the GitHub repository.

---

**Version**: 2.12.57  
**Last Updated**: 2026-11-09