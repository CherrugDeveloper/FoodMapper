# FoodMapper

A React 19, TypeScript web application for IBS (Irritable Bowel Syndrome) dietary planning and meal planning.

---

## Reproducibility Statement

This project has been designed for computational reproducibility following best practices for academic software development. All code, dependencies, and configurations are versioned and documented to enable exact reproduction of results.

## Environment Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Python**: >= 3.8 (for data analysis scripts, if applicable)

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
```

## Development Setup

### Running the Development Server

```bash
npm run dev
```

The development server will be available at `http://localhost:5173` with hot module reloading enabled.

### Running Tests

Execute the full test suite:

```bash
# Run all tests in watch mode
npm test

# Run all tests once (for CI/CD)
npm run test:run

# Run end-to-end tests
npm run test:e2e
```

### Linting and Type Checking

```bash
# Run ESLint
npm run lint

# Type checking is integrated in the build process
npm run build
```

### Build

Create a production build:

```bash
npm run build
```

This will:
1. Run TypeScript compiler in build mode
2. Build the Vite application with all dependencies bundled

Preview the build locally:

```bash
npm run preview
```

## Reproducibility for Academic Use

For academic or research use, this project supports reproducible computational workflows:

1. **Environment**: Node.js 24.x with npm 10.x
2. **Dependencies**: Exact versions locked in `package-lock.json`
3. **Tests**: Complete test suite available via `npm run test:run`
4. **Build**: Deterministic builds via `npm run build`
5. **Documentation**: Inline JSDoc comments and TypeScript types
6. **Version Control**: Git tags for each release (`git checkout v2.12.66`)

For publications, please reference:
- Repository: https://github.com/CherrugDeveloper/FoodMapper
- Version: 2.12.66
- DOI: Available via GitHub releases

## Project Structure

```
FoodMapper/
├── public/              # Static assets and GitHub Pages fallback
│   ├── _redirects       # Netlify redirect configuration
│   ├── favicon.svg      # Application favicon
│   └── manifest.json    # PWA manifest
├── src/
│   ├── components/      # React components
│   │   ├── dietPlan/    # Diet plan specific components
│   │   └── .../         # Other components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions and data
│   ├── content/         # Educational articles (multilingual)
│   ├── assets/          # Images and static resources
│   ├── i18n.ts          # Internationalization configuration
│   └── main.tsx         # Application entry point
├── tests/               # Unit and integration tests
│   ├── e2e/             # End-to-end tests with Playwright
│   └── __mocks__/       # Test mocks
├── package.json         # Project configuration and dependencies
└── vite.config.ts       # Vite build configuration
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run lint` | Run ESLint code analysis |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode (Vitest) |
| `npm run test:run` | Run tests once |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run test:ci` | Run e2e tests in CI mode |

## Internationalisation (i18n)

The application supports multiple languages through i18next:

---
+ English (default)
+ Italian
+ Spanish
+ French
+ German
+ Chinese

Language detection is automatic based on browser preferences. Manual language switching is available in the application interface.

## Data Sources

The application uses the following data files:

- `src/utils/foodsData.ts` - Food database with nutritional information
- `src/utils/nutritionEngine.ts` - Nutritional calculation engine
- `src/utils/mealGenerator.ts` - Meal plan generation algorithms
- `src/utils/workoutData.ts` - Workout exercise database
- `src/utils/educationData.ts` - Educational content for the knowledge hub

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
```

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

Current version: **2.12.66**

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Acknowledgments

- Built with ❤️ for the IBS community
- Uses React, Vite, and Tailwind CSS
- Internationalized with i18next