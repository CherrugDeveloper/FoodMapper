# FoodMapper

A comprehensive web application designed to support individuals managing Irritable Bowel Syndrome (IBS) through dietary planning, nutritional tracking, and symptom monitoring.

[🍽️ Live Demo](https://cherrugdeveloper.github.io/FoodMapper/) | [📖 Documentation](#documentation) | [🏗️ Project Structure](#project-structure) | [🤝 Contributing](#contributing) | [📜 License](#license) | [🔖 Version](#version) | [ 🙏 Acknowledgments](#acknowledgments)

---

## Features

### 🍽️ Diet Planning

- Three-phase IBS diet protocol (Elimination, Reduction, Maintenance)
- Flexible meal count customization (1-8 meals per day)
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
- Water and sleep tracking

### 🌍 Internationalization

- Full i18n support with i18next
- Available in 6 languages: English, Italian, Spanish, French, German, and more
- Bilingual food search matching

---

## Installation

### Prerequisites

- Node.js 24.x or higher
- npm 10.x or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git

# Navigate to project directory
cd FoodMapper

# Install dependencies
npm install
```

### Development

```bash
# Start development server (default: http://localhost:5173)
npm run dev

# Open browser for testing
npx serve -s dist
```

### Build for Production

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

### Production Deployment

The application can be deployed to any static hosting service. The build output is in the `dist/` directory.

---

## Usage

### Development

```bash
# Start development server
npm run dev

# Run tests
npm run test:run

# Run linting
npm run lint
```

### Testing

#### Unit Tests

```bash
npm run test:run
```

#### E2E Tests

```bash
npm run test:e2e
```

The project includes comprehensive test coverage with:
- 120+ unit tests covering all core utilities and hooks
- E2E tests validating critical user flows
- CI/CD pipeline running full test matrix

---

## Documentation

### Project Structure

```
FoodMapper/
├── public/              # Static assets and locales
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── i18n.ts         # i18next configuration
│   └── App.tsx         # Main application
├── tests/              # Test files
├── package.json        # Project configuration
└── vite.config.ts      # Vite configuration
```

### Key Components

- **DietPlan**: Three-phase IBS diet management with meal generation
- **Diary**: Food and symptom tracking with nutritional analysis
- **DayNavigator**: Interactive calendar for date selection
- **FoodFilter**: Searchable food database with FODMAP filtering
- **NutritionalCalculator**: Real-time macro and micro nutrient calculations

### Architecture

The application follows a component-based architecture with:
- React functional components with hooks
- TypeScript for type safety
- Tailwind CSS v4 for styling
- React Router v7 for routing
- i18next for internationalization

---

## Contributing

This project follows the Keep a Changelog format and uses semantic versioning (SemVer 2.0.0).

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript strict mode enabled
- ESLint with React hooks rules
- Prettier for code formatting
- All tests must pass before merging

### Pull Request Process

1. Update README.md with any significant changes to architecture
2. Update CHANGELOG.md with any user-facing changes
3. Ensure all tests pass and linting is clean
4. Request review from maintainers

---

## Version

Current version: **2.12.66**

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with ❤️ for the IBS community
- Uses React, Vite, and Tailwind CSS
- Internationalized with i18next
- [Monash University FODMAP research](https://www.monash.edu/fodmap)
- [EFSA dietary guidelines](https://efsa.europa.eu)
- React and Vite communities

---

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