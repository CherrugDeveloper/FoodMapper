# FoodMapper

A research-grade IBS dietary planning and nutritional tracking application with multilingual support and comprehensive meal planning capabilities.

## Reproducibility Statement

This project follows reproducible research practices as outlined by Utrecht University's Workshop on Computational Reproducibility. The codebase is designed to be fully transparent, with all dependencies, configurations, and data sources documented.

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- Git 2.39.0 or higher

### Installation Verification

```bash
# Clone the repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm ci

# Verify installation
npm run build
```

### Running the Development Server

```bash
npm run dev
```

The development server will be available at `http://localhost:5173`.

### Running Tests

```bash
# Run all unit tests
npm run test:run

# Run E2E tests in CI mode with line reporter
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Build

```bash
npm run build
```

The production build will be output to the `dist/` directory.

## Reproducibility for Academic Use

### Environment Reproduction

To reproduce the exact research environment for this project:

1. Install Node.js v20.x (recommended for best compatibility)
2. Clone the repository: `git clone https://github.com/CherrugDeveloper/FoodMapper.git`
3. Install dependencies: `npm ci` (uses package-lock.json for exact versions)
4. Run tests: `npm run test:run` (all 122 unit tests should pass)

### Data Sources

All data sources used in this application are publicly available and documented in the source code. No proprietary or restricted data is stored in this repository.

### Citation

For academic publications, cite this project as:

```bibtex
@software{foodmapper,
   title        = {FoodMapper: IBS Dietary Planning Application},
   author       = {CherrugDeveloper},
   year         = {2026},
   publisher    = {GitHub},
   version      = {v2.12.67},
   url          = {https://github.com/CherrugDeveloper/FoodMapper}
}
```

## Project Structure

```
FoodMapper/
├── public/           # Static assets and PWA files
│   ├── locales/      # Translation files (i18n)
│   ├── manifest.json # PWA manifest
│   └── favicon.svg   # Application icon
├── src/
│   ├── components/   # React UI components
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions and data
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Application entry point
├── tests/
│   ├── unit/         # Unit tests
│   └── e2e/          # End-to-end tests
├── vite.config.ts    # Vite build configuration
└── package.json      # Dependencies and scripts
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
| `npm run test:run` | Run Vitest in non-watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run preview` | Preview production build |

## Internationalisation (i18n)

The application supports the following languages:
- 🇮🇹 Italian (default)
- 🇬🇧 English
- 🇩🇪 German
- 🇪🇸 Spanish
- 🇫🇷 French

Language selection is handled by i18next and persists across sessions. Translation files are located in `public/locales/`.

## Data Sources

### 🍽️ Diet Planning
- Nutritional requirements calculated using Mifflin-St Jeor equation
- Phase-based diet progression (4 phases)
- Meal generation with FODMAP considerations
- Food database with 44+ items including nutrition facts

### 📊 Nutritional Tracking
- Macronutrient tracking (protein, carbs, fats)
- Micronutrient monitoring
- Customizable calorie goals
- Health condition adjustments

### 🥗 Food Database
- 44 foods with detailed nutritional information
- FODMAP grouping and warnings
- Allergen highlighting
- Custom recipe creation

### 📱 Progressive Web App
- Installable on mobile devices
- Offline support via service worker
- PWA installation prompt
- Standalone mode on iOS/Android

### 🛏️ Sleep & Wellness
- Sleep tracking integration
- Rest day scheduling
- Wellness metrics monitoring

### 💪 Workout Planning
- Equipment-aware workout generation
- Animated workout demonstrations
- Progress tracking

### 📚 Educational Content
- IBS pathophysiology articles
- Differential diagnosis resources
- Treatment guidance

## Technology Stack

- **React 19** - Component framework with concurrent features
- **React Router v7** - Client-side routing
- **Vite 5** - Build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
- **i18next** - Internationalization library
- **Playwright** - End-to-end testing
- **Vitest** - Unit testing framework

### Prerequisites

- Node.js 18.17.0+ (for ESM support)
- npm 9.0.0+

```bash
# Clone the repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper

# Verify installation
npm install --legacy-peer-deps
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amFeature`)
3. Make your changes following the project's coding standards
4. Run tests to ensure all tests pass (`npm run test:run`)
5. Commit your changes (`git commit -m 'feat: add amFeature'`)
6. Push to the branch (`git push origin feature/amFeature`)
7. Open a Pull Request

### Coding Standards

- Use TypeScript for all new code
- Follow React 19 best practices with hooks
- Write comprehensive tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Citation

If you use FoodMapper in your research or publications, please cite:

```bibtex
@software{foodmapper,
   author       = {CherrugDeveloper},
   title        = {FoodMapper: IBS Dietary Planning Application},
   year         = {2026},
   month        = nov,
   publisher    = {GitHub},
   version      = {v2.12.67},
   doi          = {10.5281/zenodo.XXXXXX},
   url          = {https://github.com/CherrugDeveloper/FoodMapper}
}
```

## Acknowledgments

- **IBS Foundation** - Clinical guidelines and nutritional recommendations
- **European Food Safety Authority (EFSA)** - Nutritional reference values
- **International FODMAP Diet** - Scientific research and guidelines
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool and development server

## Support

For issues, feature requests, or contributions:
- Open an issue on GitHub: https://github.com/CherrugDeveloper/FoodMapper/issues
- Review the AGENTS.md file for contribution guidelines and coding patterns