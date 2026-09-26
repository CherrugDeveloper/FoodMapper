# IBS Nutrition App - Documentation-Specific Rules

## Project Documentation Structure

### Key Documentation Files
- **README.md**: Main project overview, setup, and usage instructions
- **AGENTS.md** (root): Non-obvious project information for AI agents
- **plans/architecture-improvements.md**: Architecture improvement proposals
- **plans/diet-plan-architecture.md**: Diet plan feature architecture details

### Translation Files
- **public/locales/{it,en,de,es,fr}/translation.json**: All UI strings
- **Italian (it)**: Primary language - all keys must exist here first
- **English (en)**: Fallback language - must have all keys
- **Other languages**: Can have subset, falls back to English then Italian

### Content Documentation
- **src/content/*.md**: Educational articles in Italian and English
  - Naming: `{topic}.{lang}.md` (e.g., `nutrizione-fondamenti.it.md`)
  - Used by EducationalHub component

## Documentation Conventions

### Translation Keys
- **Dot Notation**: Match JSON structure (e.g., `disclaimer.title`, `foods.4.name`)
- **Namespaces**: Group by feature (disclaimer, filter, diary, diet, etc.)
- **HTML in Translations**: Use `<Trans>` component for HTML elements
- **Interpolation**: Use `{{variable}}` syntax in JSON, pass as props to `t()`

### Code Comments
- **Italian Comments**: Primary language for code comments
- **JSDoc**: Use for exported functions, types, and complex logic
- **Inline Comments**: Explain "why" not "what" - code should be self-documenting

### Component Documentation
- **Props Interface**: Always define explicit TypeScript interface
- **Default Props**: Document optional props with defaults
- **Usage Examples**: Include in component file or separate .md if complex

## Non-Obvious Documentation Behaviors

### Medical Disclaimer
- **Language Selector**: Has its own language selector BEFORE Header renders
- **Acceptance Gate**: Uses `localStorage.ibs_disclaimer_accepted` (no prefix)
- **Loading State**: Shows spinner while i18n initializes
- **Do NOT**: Move language selector to Header component

### i18n Configuration
- **Detection Order**: localStorage → navigator → htmlTag
- **Cache Key**: `i18nextLng` in localStorage (managed by i18next-browser-languagedetector)
- **Preload**: Italian and English preloaded for faster initial load
- **Fallback Chain**: it → en (Italian primary, English fallback)

### Food Data Documentation
- **Seasonal Months**: Food IDs 4,5,7,8,9,10 have specific month arrays
- **Year-Round Foods**: No `months` property = available all year
- **FODMAP Levels**: 'low' or 'high' with optional `triggerGroup`
- **Alternatives**: High FODMAP foods have `alternative` field

### Search Documentation
- **Bilingual Search**: FoodFilter searches both translated AND raw names
- **Translation Key Pattern**: `foods.{id}.name` for translated names
- **Fallback**: Raw `food.name` used if translation missing

### Storage Documentation
- **Prefix Convention**: `foodmapper_` for most keys (calc_results, user_data, diet_plan)
- **Exception**: `ibs_disclaimer_accepted` has NO prefix
- **Validation**: All storage functions validate data before returning
- **Return Types**: Can return `null` - handle in calling code

### Build & Deployment
- **GitHub Pages**: `base: './'` in vite.config.ts for project sites
- **Manual Build**: `npm run build` outputs to `dist/`
- **Preview Deployments**: Triggered by pull_request in CI
- **Production Deploy**: Triggered by push to main or workflow_dispatch

### Testing Documentation
- **Unit Tests**: Vitest, colocated with source as `.test.tsx/.test.ts`
- **E2E Tests**: Playwright in `tests/e2e/`
- **Accessibility**: axe-core integrated in unit tests
- **Coverage**: Check `coverage/` after test runs

## When Asking Questions About This Project

### Always Check First
1. **AGENTS.md** (root) for non-obvious project info
2. **Translation JSON** for existing keys before adding new ones
3. **Type Definitions** in `src/types/` for data structures
4. **Storage Utils** in `src/utils/storage.ts` for data persistence patterns

### Common Misconceptions to Clarify
- **Language Selector**: Only in MedicalDisclaimer, not Header
- **Storage Prefix**: Inconsistent - disclaimer has no prefix
- **Seasonal Data**: Only 6 specific foods have month restrictions
- **Search**: Bilingual by design, not a bug
- **Tailwind v4**: Uses logical properties (margin-block, not margin-top/bottom)
- **GitHub Pages**: `base: './'` is CORRECT, not a bug

### Architecture Questions
- **State Management**: AppContext for global, useState for local, custom hooks for reusable
- **Component Structure**: Feature-based organization in src/components/
- **Code Splitting**: Vite config defines chunks - don't modify without reason
- **i18n**: i18next with HTTP backend loading from public/locales/