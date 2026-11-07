# FoodMapper

A comprehensive nutrition and wellness tracking application built with React 19, TypeScript, and Vite. FoodMapper helps users manage their diet plans, track nutritional intake, monitor sleep patterns, and maintain fitness routines.

![FoodMapper](public/icon-512.svg)

## Features

### 🍽️ Nutritional Calculator
- Calculate daily caloric needs using Mifflin-St Jeor equation
- Macronutrient distribution planning (proteins, carbs, fats)
- Water intake recommendations
- Caffeine intake calculator with EFSA safe limits
- Support for multiple dietary preferences and activity levels

### 📔 Food Diary
- Track daily food intake with detailed nutritional breakdown
- FODMAP sensitivity indicators for IBS management
- Meal timing and portion tracking
- Integration with diet plan meals

### 🍽️ Diet Plan
- Structured meal planning with phases (Preparazione, Eliminazione, Reintroduzione, Mantenimento)
- Interactive calendar with phase progress visualization
- Meal confirmation and modification capabilities
- Portion editing with real-time nutritional updates
- Day completion tracking with persistence

### 📖 Recipes
- Recipe library with detailed nutritional information
- Step-by-step cooking instructions
- Ingredient scaling and portion adjustment
- FODMAP-friendly recipe filtering

### 🛒 Shopping List
- Automatic shopping list generation from meal plans
- Item categorization and quantity management
- Check-off functionality with persistence

### 💪 Workout Plan
- Exercise library with GIF demonstrations
- Workout scheduling and tracking
- Progress monitoring

### 🌙 Sleep Tracker
- Sleep duration and quality logging
- Sleep phase visualization
- Sleep advice and recommendations
- Ambient sleep sounds

### 🔍 Food Filter
- Comprehensive food database with FODMAP ratings
- Bilingual search (translated names and raw food names)
- Nutritional information per 100g
- Seasonal food indicators

### 📚 Educational Hub
- Nutrition science articles
- Metabolic health guides
- Absorption mechanisms explanations
- Hormonal regulation of appetite

### 🌍 Internationalization
- Full support for Italian, English, German, Spanish, and French
- Browser language detection with manual override
- Persistent language preference

### 📱 PWA Features
- Installable as a Progressive Web App
- Offline support with service worker
- Window controls overlay for desktop-like experience
- Background sync capabilities

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Internationalization**: i18next with react-i18next
- **State Management**: React Context API
- **Testing**: Vitest + Playwright (E2E)
- **PWA**: vite-plugin-pwa v2
- **Code Quality**: ESLint with TypeScript ESLint

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: Node.js 20+)
- npm 9+ or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Type-check and build
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run unit tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── components/           # React components
│   ├── dietPlan/        # Diet plan specific components
│   ├── Changelog.tsx    # Version history display
│   ├── Diary.tsx        # Food diary tracking
│   ├── DietPlan.tsx     # Main diet plan interface
│   ├── EducationalHub.tsx # Educational content
│   ├── FoodFilter.tsx   # Food database browser
│   ├── Header.tsx       # Navigation header
│   ├── InfoPopup.tsx    # Interactive tooltips
│   ├── MedicalDisclaimer.tsx # Legal disclaimer gate
│   ├── NutritionalCalculator.tsx # Calorie/macro calculator
│   ├── RecipeDetail.tsx # Recipe details view
│   ├── Recipes.tsx      # Recipe library
│   ├── ShoppingList.tsx # Shopping list manager
│   ├── SleepTracker.tsx # Sleep tracking dashboard
│   └── WorkoutPlan.tsx  # Workout planner
├── context/             # React Context providers
│   ├── AppContext.ts    # Global app state
│   └── AppContextTypes.ts # TypeScript types
├── hooks/               # Custom React hooks
│   ├── useDietPlan.ts   # Diet plan logic
│   ├── useFoodSearch.ts # Bilingual food search
│   ├── useNotificationPermission.ts # Browser notifications
│   └── useToast.ts      # Toast notifications
├── utils/               # Utility functions
│   ├── navigation.ts    # Race-condition-safe navigation
│   ├── nutritionCalculator.ts # Memoized nutrition calculations
│   ├── storage.ts       # LocalStorage with validation
│   └── infoPopups.ts    # Tooltip content management
├── types/               # TypeScript type definitions
├── content/             # Educational content (Markdown)
└── public/locales/      # Translation files (5 languages)
```

## Key Implementation Details

### Navigation Race Condition Protection
The application implements a robust navigation system in `src/utils/navigation.ts` that prevents race conditions during rapid route changes using duplicate path checks and a centralized event bus pattern.

### Memoized Nutrition Calculations
Nutritional calculations in `src/utils/nutritionCalculator.ts` use memoization to avoid redundant computations when processing large food databases.

### Double requestAnimationFrame Pattern
InfoPopup components use a double `requestAnimationFrame` pattern for stable initial positioning, preventing visual flickering on first render.

### Bilingual Food Search
The `useFoodSearch` hook implements bilingual search matching both translated food names and raw database names for comprehensive results.

### Seasonal Food Detection
Foods with IDs 4, 5, 7, 8, 9, 10 are marked as seasonal using the `food.months` array; foods without months are available year-round.

### Storage Keys
- Most persistence keys use `foodmapper_` prefix
- Exception: `ibs_disclaimer_accepted` (no prefix) for disclaimer acceptance gate

## Deployment

The application is configured for GitHub Pages deployment with:
- Base path: `./` (required for correct routing)
- SPA fallback via `404.html` redirect
- PWA manifest and service worker generation
- No GitHub Actions sourcemaps in production

```bash
# Deploy to GitHub Pages
npm run build
# Push dist/ contents to gh-pages branch
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

Requires ES2020+ support for optional chaining, nullish coalescing, and dynamic imports.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history following [Keep a Changelog](https://keepachangelog.com) format.

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/cherrugdeveloper/FoodMapper/issues) page.

---

Built with ❤️ using React, TypeScript, and Vite