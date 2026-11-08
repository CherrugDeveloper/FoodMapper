# FoodMapper

FoodMapper is a comprehensive nutrition and wellness planning application designed for individuals managing Irritable Bowel Syndrome (IBS) and related dietary needs.

## Overview

FoodMapper provides a complete toolkit for nutritional calculation, meal planning, food tracking, and wellness management. The application supports multiple languages and features a Progressive Web App (PWA) architecture for offline functionality.

### Key Features

- **Nutritional Calculator**: Compute daily caloric needs using Mifflin-St Jeor equation with customizable macronutrient distributions
- **Food Diary**: Track daily food intake with automated nutritional analysis and water tracking
- **Diet Plan**: Generate personalized phase-based diet plans with calendar visualization
- **Recipe Database**: Access a comprehensive database of IBS-friendly recipes with nutritional information
- **Shopping List**: Generate shopping lists based on planned meals and logged food items
- **Workout Plan**: Track exercise routines with automated calculations and progress monitoring
- **Sleep Tracker**: Monitor sleep patterns and receive scientific-backed recommendations
- **Educational Hub**: Access evidence-based articles on nutrition, digestion, and IBS management
- **Internationalized**: Full support for English, Italian, Spanish, French, and German languages

## Project Structure

```
FoodMapper/
├── src/
│   ├── components/          # React UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions and data
│   ├── content/            # Educational articles (multi-language)
│   └── i18n.ts             # Internationalization configuration
├── public/
│   └── locales/            # Translation files (en, es, fr, de, it)
├── tests/                  # Unit and integration tests
└── e2e/                    # End-to-end tests (Playwright)
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git 2.30.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |
| `npm run test` | Run test suite in watch mode |
| `npm run test:run` | Run test suite once |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:ci` | Run E2E tests in CI mode |

### Testing

Run the test suite:
```bash
npm run test:run
```

Run end-to-end tests:
```bash
npm run test:e2e
```

## Language Support

FoodMapper supports the following languages:

| Language | Code |
|----------|------|
| English | en |
| Italian | it |
| Spanish | es |
| French | fr |
| German | de |

Language selection is managed automatically by i18next based on browser preferences.

## Browser Compatibility

- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

The application is fully functional as a Progressive Web App with offline capabilities.

## Configuration

### Environment Variables

No environment variables are required for basic operation. The application uses i18next HTTP backend for loading translation files.

### Vite Configuration

The application uses Vite with the following key settings:
- GitHub Pages base path: `./` (required for client-side routing)
- Tailwind CSS v4 with JIT compilation
- TypeScript with React JSX support

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure all pass
5. Submit a pull request

### Development Guidelines

- All code must pass TypeScript type checking
- ESLint must report no errors
- All tests must pass (unit and E2E)
- Follow the existing code style and patterns

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - Frontend library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [i18next](https://www.i18next.com/) - Internationalization
- [Mifflin-St Jeor Equation](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2870867/) - BMR calculation

## Version History

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes.

## Contact

For questions or issues, please open an issue on the GitHub repository.

---

*This README was generated following the Utrecht University Workshop on Computational Reproducibility conventions.*