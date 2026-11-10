# FoodMapper

**Personalized Nutrition & Diet Planning for IBS Management**

A comprehensive web application designed to support individuals managing Irritable Bowel Syndrome (IBS) through personalized meal planning, nutritional tracking, and dietary guidance.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

FoodMapper is a progressive web application (PWA) that provides:

- **Personalized Diet Planning**: Generate tailored meal plans based on specific IBS phase protocols
- **Nutritional Analysis**: Calculate daily nutritional intake with detailed macronutrient breakdowns
- **Food Database**: Comprehensive Low-FODMAP food database with nutritional information
- **Progress Tracking**: Monitor diet phases, meal consumption, and nutritional goals
- **International Support**: Full localization in 6 languages (English, Italian, Spanish, French, German, Chinese)

---

## Features

### 🍽️ Diet Planning
- Three-phase IBS diet protocol (Elimination, Reduction, Maintenance)
- Flexible meal count customization (1-7 meals per day)
- Automatic meal generation with balanced nutrition
- Phase progress tracking and visualization

### 📊 Nutritional Tracking
- Real-time calorie and macronutrient calculations
- Micronutrient analysis including vitamins and minerals
- Customizable nutritional targets
- Historical diary entries with nutritional summaries

### 🥗 Food Database
- Low-FODMAP certified food entries
- FODMAP group categorization
- Portion size recommendations
- Allergen filtering capabilities

### 📱 Progressive Web App
- Offline functionality
- Home screen installation
- Push notifications for medication reminders
- Responsive design for all devices

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 with TypeScript 5.6 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | React Context + Hooks |
| **Internationalization** | i18next |
| **Routing** | React Router 7 |
| **PWA** | vite-plugin-pwa |
| **Testing** | Vitest, React Testing Library, Playwright |

---

## Installation

### Prerequisites
- Node.js 24.x or higher
- npm 10.x or higher

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

### Build for Production

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

---

## Usage

### Development
```bash
# Start development server (default: http://localhost:5173)
npm run dev

# Run linting
npm run lint

# Run tests
npm run test:run
```

### Production
The application can be deployed to any static hosting service. The build output is in the `dist/` directory.

---

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test:run` | Run Vitest tests |
| `npm run test:e2e` | Run Playwright E2E tests |

### Project Configuration

- **TypeScript**: Strict mode enabled with ESLint and TypeScript integration
- **Tailwind CSS**: Logical spacing utilities, CSS variables for theming
- **PWA**: Configured with web manifest and service worker

---

## Testing

### Unit Tests
```bash
npm run test:run
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
- Unit tests cover all core utilities and hooks
- E2E tests validate critical user flows
- CI/CD pipeline runs full test matrix

---

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── dietPlan/          # Diet plan specific components
│   └── ...                # Other components
├── context/               # React context providers
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions and data
├── content/               # Educational articles (multilingual)
├── assets/                # Images and static assets
├── i18n.ts               # Internationalization configuration
└── main.tsx              # Application entry point
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all tests pass and linting is clean before submitting.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Version

Current version: **2.12.61**

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Acknowledgments

- Built with ❤️ for the IBS community
- Uses React, Vite, and Tailwind CSS
- Internationalized with i18next