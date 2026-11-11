# FoodMapper

A React 19, TypeScript web application for IBS (Irritable Bowel Syndrome) dietary planning and meal planning.

---

## Reproducibility Statement

This project has been designed for computational reproducibility following best practices for academic software development. All code, dependencies, and configurations are versioned and documented to enable exact reproduction of results.

This repository follows the [Utrecht University Workshop on Computational Reproducibility](https://utrechtuniversity.github.io/workshop-computational-reproducibility/) guidelines for transparent, auditable, and citable software artifacts.

---

## Environment Requirements

### Prerequisites

- **Node.js**: >= 18.0.0 (tested with Node.js 24.x LTS)
- **npm**: >= 10.0.0
- **Operating System**: Linux, macOS, or Windows with WSL2 support

### Setup

```bash
# Clone the repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install
```

---

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

The development server will be available at `http://localhost:5173` with hot module reloading enabled. All React Fast Refresh features are active for rapid iteration.

### Running Tests

Execute the full test suite:

```bash
# Run all tests in watch mode (development)
npm test

# Run all tests once (for CI/CD)
npm run test:run

# Run end-to-end tests
npm run test:e2e

# Run e2e tests in CI mode with line reporter
npm run test:ci
```

### Linting and Type Checking

```bash
# Run ESLint
npm run lint

# Type checking (integrated in build process)
npm run build
```

### Build

Create a production build:

```bash
npm run build
```

This performs:
1. TypeScript compiler in build mode (`tsc -b`)
2. Vite build with all dependencies bundled
3. PWA service worker generation
4. Manifest and icon generation

To preview the production build locally:

```bash
npm run preview
```

---

## Reproducibility for Academic Use

This project follows the reproducibility checklist:

| Criterion | Implementation |
|-----------|----------------|
| **Version Control** | Git with semantic versioning; all releases tagged |
| **Dependencies** | Exact versions locked in `package-lock.json` |
| **Build Process** | Deterministic builds via `npm run build` |
| **Tests** | Complete unit + integration tests via `npm run test:run` |
| **Tests (E2E)** | Playwright tests for critical user flows |
| **Documentation** | Inline JSDoc comments, TypeScript types, changelog |
| **Data** | Food database and nutritional data in source control |
| **Licensing** | SPDX-compliant LICENSE file with citation guidance |

For academic publications, cite this project as:

```bibtex
@software{foodmapper,
  author       = {CherrugDeveloper},
  title        = {FoodMapper: IBS Dietary Planning Application},
  year         = {2026},
  publisher    = {GitHub},
  version      = {v2.12.67},
  url          = {https://github.com/CherrugDeveloper/FoodMapper}
}
```

---

## Project Structure

```
FoodMapper/
├── .github/               # GitHub workflows and issue templates
│   └── workflows/         # CI/CD pipelines (Vitest, Playwright)
├── public/                # Static assets and GitHub Pages configuration
│   ├── _redirects         # SPA routing support
│   ├── 404.html           # SPA deep-linking fallback
│   ├── favicon.svg        # Application icon
│   ├── icons.svg          # PWA icons
│   ├── manifest.json      # PWA manifest
│   └── locales/           # Translation files (i18next)
│       ├── en/
│       ├── it/
│       ├── es/
│       ├── fr/
│       ├── de/
│       └── zh/
├── src/
│   ├── components/        # React components by feature
│   │   ├── dietPlan/      # Diet planning UI
│   │   ├── e2e/           # E2E test components
│   │   └── ...            # Other components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions and data
│   │   ├── foodsData.ts   # Food database
│   │   ├── nutritionEngine.ts
│   │   ├── mealGenerator.ts
│   │   └── ...            # Other utilities
│   ├── content/           # Educational articles (multilingual)
│   ├── assets/            # Images and static resources
│   ├── i18n.ts            # Internationalization setup
│   └── main.tsx           # Application entry point
├── tests/                 # Test suite
│   ├── e2e/               # Playwright E2E tests
│   └── __mocks__/         # Test mocks
├── package.json           # Project configuration and dependencies
├── vite.config.ts         # Vite build configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json      # App-specific TypeScript settings
├── tsconfig.e2e.json      # E2E test TypeScript settings
└── AGENTS.md              # AI agent instructions and project documentation
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build (TypeScript + Vite) |
| `npm run lint` | Run ESLint code analysis |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests in watch mode (Vitest) |
| `npm run test:run` | Run tests once (CI-ready) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run test:ci` | Run e2e tests in CI mode |

---

## Internationalisation (i18n)

The application supports automatic language detection via i18next with the following languages:

| Language | Code | Status |
|----------|------|--------|
| English | en | Default |
| Italian | it | ✅ Complete (1425+ keys) |
| Spanish | es | ✅ Complete |
| French | fr | ✅ Complete |
| German | de | ✅ Complete |
| Chinese | zh | ✅ Complete |

Language detection is automatic based on browser preferences. Manual language switching is available in the application interface via the language selector in the header.

---

## Data Sources

The application uses curated data sources:

| File | Purpose |
|------|---------|
| `src/utils/foodsData.ts` | Food database with nutritional information, FODMAP levels, trigger groups |
| `src/utils/nutritionEngine.ts` | Nutritional calculation engine (Mifflin-St Jeor equation) |
| `src/utils/mealGenerator.ts` | Meal plan generation algorithms |
| `src/utils/workoutData.ts` | Exercise and workout database |
| `src/utils/sleepData.ts` | Sleep tracking utilities |
| `src/utils/educationalData.ts` | Evidence-based IBS educational content |

---

## Features

### 🍽️ Diet Planning
- Three-phase IBS diet protocol (Elimination → Reduction → Maintenance)
- Flexible meal count customization (1-7 meals per day)
- Automatic balanced meal generation with nutritional targets
- Phase progress tracking and visualizations
- Weekend indicator with color-coded feedback

### 📊 Nutritional Tracking
- Real-time calorie and macronutrient calculations
- Micronutrient analysis (vitamins, minerals, fiber)
- Customizable nutritional targets per phase
- Historical diary entries with nutritional summaries
- Water tracking with notification reminders

### 🥗 Food Database
- 850+ low-FODMAP certified food entries
- FODMAP group categorization (fructans, galactans, etc.)
- Portion size recommendations with serving variants
- Allergen filtering (gluten, dairy, nuts, etc.)
- Seasonal food indicators

### 📱 Progressive Web App
- Offline functionality with service worker caching
- Home screen installation (PWA)
- Push notifications for medication/water reminders
- Responsive design for mobile and desktop
- 404.html fallback for SPA deep-linking

### 🛏️ Sleep & Wellness
- Sleep tracking with duration and quality metrics
- Sleep sounds and relaxation audio
- Transit scoring correlation
- Water reminder notifications

### 💪 Workout Planning
- Exercise database with muscle group targeting
- Workout plan generation
- Progress tracking

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | React 19 | ✓ |
| **Language** | TypeScript | 5.6 |
| **Build Tool** | Vite | 8.3 |
| **Styling** | Tailwind CSS | 4.x |
| **State Management** | React Context + Hooks | — |
| **Internationalization** | i18next | 26.x |
| **Routing** | React Router | 7.x |
| **PWA** | vite-plugin-pwa | 2.x |
| **Unit/Integration Tests** | Vitest + React Testing Library | — |
| **E2E Tests** | Playwright | 1.64 |
| **Linting** | ESLint + typescript-eslint | — |

---

## Installation

### Prerequisites
- Node.js 24.x LTS or higher
- npm 10.x or higher
- Git 2.40+

### Setup

```bash
# Clone the repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install

# Verify installation
npm run test:run
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Before submitting:**
- Ensure all tests pass: `npm run test:run`
- Run ESLint: `npm run lint`
- Build succeeds: `npm run build`
- Add/update tests for new functionality
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**MIT License Summary:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ Liability disclaimed
- ❌ Warranty disclaimed
- ❌ Patent grant provided
- ❌ Trademark use requires permission

For questions about licensing or commercial use, please open an issue.

---

## Citation

If you use FoodMapper in your research or publications, please cite:

```bibtex
@software{foodmapper,
  author       = {CherrugDeveloper},
  title        = {{FoodMapper: An IBS Dietary Planning Application}},
  year         = {2026},
  month        = nov,
  publisher    = {GitHub},
  version    = {v2.12.67},
  doi          = {10.5281/zenodo.XXXXXX},
  url          = {https://github.com/CherrugDeveloper/FoodMapper}
}
```

---

Current version: **2.12.66**

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Acknowledgments

- Built with ❤️ for the IBS community
- Developed by CherrugDeveloper
- Internationalisation powered by [i18next](https://www.i18next.com/)
- Framework: [React](https://react.dev/), [Vite](https://vitejs.dev/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- PWA: [vite-plugin-pwa](https://vite-plugin-pwa.vercel.app/)

---

## Support

- 📧 Issues: [GitHub Issues](https://github.com/CherrugDeveloper/FoodMapper/issues)
- 📖 Documentation: See inline code comments and AGENTS.md
- 🐛 Bug Reports: Use the issue template

---

*Last updated: 2026-11-11*
*Version: 2.12.66*

Current version: **2.12.66**

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Acknowledgments

- Built with ❤️ for the IBS community
- Developed by CherrugDeveloper
- Internationalisation powered by [i18next](https://www.i18next.com/)
- Framework: [React](https://react.dev/), [Vite](https://vitejs.dev/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- PWA: [vite-plugin-pwa](https://vite-plugin-pwa.vercel.app/)

---

## Support

- 📧 Issues: [GitHub Issues](https://github.com/CherrugDeveloper/FoodMapper/issues)
- 📖 Documentation: See inline code comments and AGENTS.md
- 🐛 Bug Reports: Use the issue template

---

*Last updated: 2026-11-11*
*Version: 2.12.66*