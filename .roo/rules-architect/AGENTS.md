# IBS Nutrition App - Architecture-Specific Rules

## System Architecture Overview

### Project Structure
- **src/components/**: All UI components organized by feature
- **src/context/**: AppContext for global state management
- **src/hooks/**: Custom hooks for reusable logic
- **src/utils/**: Core business logic and utilities
- **src/types/**: TypeScript type definitions
- **src/content/**: Educational article content

### Build System
- **Vite**: Fast development server with TypeScript support
- **Tailwind v4**: CSS framework with logical properties
- **Vitest**: Unit testing framework
- **Playwright**: E2E testing framework
- **GitHub Pages**: Production deployment target

## Architecture Patterns

### State Management
- **AppContext**: Centralized state for user preferences, theme, etc.
- **Component State**: useState for local component state
- **Custom Hooks**: Extract reusable async logic (useDietPlan, useRecipes, etc.)
- **Storage Integration**: All persistent state goes through storage utils

### Component Architecture
- **Feature Components**: Each major feature has dedicated component file
- **PascalCase Naming**: Component files use PascalCase (NutritionalCalculator.tsx)
- **Hook Organization**: Custom hooks use camelCase with "use" prefix (useDietPlan.ts)
- **Utility Functions**: camelCase for utility functions (nutritionCalculator.ts)

### Data Flow
- **Props Drilling**: Minimal - use AppContext for distant component communication
- **Custom Hooks**: Extract data fetching and business logic
- **Type Safety**: Explicit TypeScript interfaces everywhere
- **Validation**: Storage functions include validation

## Non-Obvious Architecture Decisions

### GitHub Pages Configuration
- **vite.config.ts**: `base: './'` is CORRECT for GitHub Pages project site
  - This ensures proper routing for single-page applications
  - Do NOT change to '/' unless deploying to root domain
  - This is a common point of confusion for developers

### Build Chunking
- **Vite Config**: Manual chunks defined in vite.config.ts
  - Vendor chunks: React, i18n, markdown libraries
  - Feature chunks: Each major feature gets its own chunk
  - Shared utilities: Common code across features
- **Don't Modify**: Unless necessary - chunking is already optimized

### i18n Architecture
- **Backend Loading**: i18next-http-backend loads from public/locales/
- **Language Detection**: i18next-browser-languagedetector with localStorage cache
- **Preload Strategy**: Italian and English preloaded for faster initial load
- **Fallback Chain**: it → en (Italian primary, English fallback)

### Storage Architecture
- **Prefix Pattern**: `foodmapper_` for most storage keys
- **Exception**: `ibs_disclaimer_accepted` has NO prefix
- **Type Safety**: Each storage type has dedicated functions (calcStorage, userDataStorage, etc.)
- **Validation**: All storage functions validate data before returning

## Component-Specific Architecture

### MedicalDisclaimer
- **Early Render**: Renders before Header component
- **Language Selector**: Built-in language selector inside modal
- **Acceptance Gate**: Uses localStorage.ibs_disclaimer_accepted
- **Loading State**: Shows spinner while i18n initializes

### FoodFilter
- **Bilingual Search**: Searches both translated and raw food names
- **Seasonal Logic**: Food IDs 4,5,7,8,9,10 have month restrictions
- **Category Filter**: Six categories including 'All'
- **Exclusion Logic**: Can exclude specific FODMAP trigger groups

### Diary Component
- **Water Reminder**: Uses real Notification.requestPermission()
- **Permission States**: 'on', 'off', 'denied', 'unsupported'
- **Reminder Logic**: Interval-based with proper cleanup

## Build & Deployment Architecture

### CI/CD Pipeline
- **ci.yml**: Multiple jobs (lint, typecheck, unit, build, e2e, deploy-preview)
- **deploy-production.yml**: Separate production deployment
- **Deploy.yml**: Alternative deployment workflow
- **Node Version**: Inconsistent - fix to use Node 24 consistently

### GitHub Workflow Issues
- **ubuntu-26**: Invalid - use `ubuntu-latest` or `ubuntu-24.04`
- **Node Version**: deploy-production.yml uses Node 20, others use Node 24
- **Fix**: Use consistent Node version (prefer 24)

### Build Process
- **Development**: `npm run dev` with hot reload
- **Production**: `npm run build` outputs to `dist/`
- **Testing**: `npm test` runs Vitest unit tests
- **E2E**: `npx playwright test` for end-to-end tests

## Performance Architecture

### Code Splitting
- **Vite Config**: Already implements chunking
- **Don't Modify**: Unless necessary
- **Bundle Analysis**: Check `dist/stats.html` after builds

### Memoization
- **useMemo**: For expensive calculations
- **useCallback**: For function references
- **Examples**: Diary component shows proper memoization patterns

### Image Optimization
- **Vite Assets**: src/assets/ automatically optimized
- **Hero Image**: src/assets/hero.png
- **Framework Logos**: react.svg, vite.svg

## Testing Architecture

### Unit Tests
- **Vitest**: Fast unit testing framework
- **Colocated**: Tests in same directory as source (.test.tsx)
- **Mocking**: Built-in mocking for modules and browser APIs
- **Coverage**: Check coverage after test runs

### E2E Tests
- **Playwright**: End-to-end testing
- **tests/e2e/**: Critical user flows
- **Data Test IDs**: Use data-testid for reliable selectors
- **Accessibility**: axe-core violations in test output

## Common Architecture Pitfalls

### Language Selection
- **MedicalDisclaimer**: Has its own language selector
- **Do NOT**: Move to Header component
- **Why**: Language must be selected before app loads

### Storage Keys
- **Prefix Inconsistency**: Most use 'foodmapper_', disclaimer doesn't
- **Remember**: This inconsistency must be maintained
- **Validation**: Storage functions validate data

### Tailwind v4
- **Logical Properties**: margin-block-end, not margin-top/bottom
- **CSS Variables**: --text, --bg, --accent, etc.
- **Mobile-First**: sm:, md:, lg: prefixes

### Seasonal Data
- **Food IDs**: 4,5,7,8,9,10 have month restrictions
- **Don't Hardcode**: Use food.months array
- **Year-Round**: No months property = available all year

### Search
- **Bilingual**: Both t('foods.{id}.name') AND food.name
- **Do NOT Remove**: Either search condition
- **Case Insensitive**: Both searches use .toLowerCase()

## When Planning Architecture Changes

### Consider These Rules
1. **GitHub Pages**: base: './' is correct
2. **Storage Prefix**: Inconsistent - maintain it
3. **Language Selector**: Only in MedicalDisclaimer
4. **Tailwind v4**: Logical properties
5. **Seasonal Foods**: Only 6 foods have month restrictions
6. **Search**: Bilingual by design
7. **Node Version**: Fix inconsistencies
8. **Ubuntu Version**: Fix ubuntu-26 to ubuntu-latest

### Breaking Changes
- **Storage Keys**: Changing prefix would break existing data
- **Language Selector**: Moving would break disclaimer flow
- **Search Logic**: Removing either condition breaks bilingual support
- **Tailwind Properties**: Would break responsive design

### Safe Modifications
- **Component Organization**: Can refactor as long as interfaces stay same
- **Hook Extraction**: Can extract logic into custom hooks
- **Type Refactoring**: Can improve types without breaking runtime
- **Test Updates**: Can add new tests for existing functionality