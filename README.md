# FoodMapper

A React 19, TypeScript web application for IBS (Irritable Bowel Syndrome) dietary planning and meal planning.

## Reproducibility Statement

This project has been designed for computational reproducibility following best practices for academic software development. All code, dependencies, and configurations are versioned and documented to enable exact reproduction of results.

## Environment Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Python**: >= 3.8 (for data analysis scripts, if applicable)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper
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

## Build

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
│   │   ├── diary/       # Diary component
│   │   └── .../         # Other components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions and data
│   ├── assets/          # Images and static resources
│   ├── i18n.ts          # Internationalisation setup
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
| `npm test` | Run tests in watch mode (Vitest) |
| `npm run test:run` | Run tests once |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run test:ci` | Run e2e tests in CI mode |

## Internationalisation (i18n)

The application supports multiple languages through i18next:

- English (default)
- Italian
- Spanish
- French
- German

Language detection is automatic based on browser preferences. Manual language switching is available in the application interface.

## Data Sources

The application uses the following data files:

- `src/utils/foodsData.ts` - Food database with nutritional information
- `src/utils/nutritionEngine.ts` - Nutritional calculation engine
- `src/utils/mealGenerator.ts` - Meal plan generation algorithms
- `src/utils/workoutData.ts` - Workout exercise database
- `src/utils/educationData.ts` - Educational content for the knowledge hub

## Browser Support

- Chrome >= 109
- Firefox >= 115
- Safari >= 16.4
- Edge >= 109

## GitHub Pages Deployment

This project is configured for GitHub Pages deployment. The base URL is set in `package.json`:

```json
"homepage": "https://CherrugDeveloper.github.io/FoodMapper/"
```

The Vite configuration includes proper base path handling for client-side routing with 404 fallback support.

## Progressive Web App (PWA)

The application supports PWA features including:

- Installable on device home screen
- Offline capability via service worker
- Push notifications for water reminders and medication alerts

## Testing Framework

- **Unit/Integration Tests**: Vitest with React Testing Library
- **End-to-End Tests**: Playwright Test
- **Test Coverage**: 120 test cases covering core functionality

## Version Control

- **Semantic Versioning**: Strictly followed (MAJOR.MINOR.PATCH)
- **Changelog Format**: Keep a Changelog v1.1.0 compliant
- **Commit Messages**: Follow conventional commit format

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md) for a complete history of changes.

## License

See [LICENSE](./LICENSE) file for details.

## Author

FoodMapper was developed by CherrugDeveloper as part of an academic project for IBS dietary management.

## Citation

If you use FoodMapper in your research or educational work, please cite:

```bibtex
@software{foodmapper,
  author = {CherrugDeveloper},
  title = {FoodMapper: A React application for IBS dietary planning},
  year = {2026},
  url = {https://github.com/CherrugDeveloper/FoodMapper},
  version = {2.12.66}
}
```

## Acknowledgments

- React 19 for component architecture
- Vite for fast development and building
- Tailwind CSS v4 for styling
- i18next for internationalisation
- Vitest and Playwright for testing