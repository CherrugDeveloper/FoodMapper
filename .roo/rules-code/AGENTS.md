# IBS Nutrition App - Coding-Specific Rules

## TypeScript & React Guidelines
- **Component Organization**: Keep components small and focused. Each major feature (Diary, DietPlan, etc.) should have its own component file
- **Type Safety**: Always define explicit types for props and state. Use the existing type definitions in src/types/ as reference
- **Event Handlers**: Use React synthetic events with proper typing (e.g., React.ChangeEvent<HTMLInputElement>)
- **Async Operations**: Handle loading states and errors properly in async functions (use try/catch, loading booleans)

## State Management
- **AppContext**: Use for global state that needs to be shared across distant components (user preferences, theme, etc.)
- **Local State**: Use useState for component-specific state that doesn't need to be shared
- **Custom Hooks**: Extract reusable logic into custom hooks (useDietPlan, useRecipes, etc.) - follow the pattern in src/hooks/

## Styling with Tailwind v4
- **Logical Properties**: Remember that Tailwind v4 uses logical properties (margin-block-start/end instead of margin-top/bottom)
- **Dark Mode**: Uses CSS variables (--text, --bg, etc.) defined in index.css @layer base
- **Component Variants**: Use the existing color scheme variables (--text-h, --accent, --code-bg, --border) for consistency
- **Responsive Design**: Use mobile-first approach with sm:, md:, lg: prefixes

## File Naming & Organization
- **Components**: PascalCase for component files (e.g., NutritionalCalculator.tsx)
- **Hooks**: camelCase with "use" prefix (e.g., useDietPlan.ts)
- **Utils**: camelCase for utility functions (e.g., nutritionCalculator.ts)
- **Tests**: Match component name with .test.tsx extension (e.g., NutritionalCalculator.test.tsx)

## Internationalization (i18n)
- **Translation Keys**: Use dot notation matching the JSON structure (e.g., t('disclaimer.title'))
- **Component Names**: Use Trans component for HTML elements within translations
- **Language Detection**: Respect the i18next configuration - language is stored in localStorage.i18nextLng
- **Fallback Languages**: Italian ('it') is primary, English ('en') is fallback

## Storage Patterns
- **Prefixed Storage**: Most storage uses 'foodmapper_' prefix (see src/utils/storage.ts)
- **Exception**: Medical disclaimer uses 'ibs_disclaimer_accepted' without prefix
- **Type Safety**: Always use the provided storage utility functions (calcStorage, userDataStorage, etc.)
- **Validation**: Storage functions include validation - respect the return types (can be null)

## Testing Conventions
- **Test Files**: Place alongside source files with .test.tsx/.test.ts extension
- **Mocking**: Use Vitest mocking capabilities for API calls and browser APIs
- **Accessibility**: Include axe-core tests for accessibility compliance
- **E2E**: Playwright tests in tests/e2e/ cover critical user flows

## Performance Considerations
- **Code Splitting**: Vite config already implements chunking - don't modify unless necessary
- **Memoization**: Use useMemo and useCallback appropriately (see Diary.tsx for examples)
- **Image Optimization**: Assets in src/assets/ are automatically optimized by Vite
- **Bundle Analysis**: Check dist/stats.html after builds to monitor bundle size

## Common Pitfalls to Avoid
- **Direct DOM Access**: Avoid using document.getElementById() - use refs instead
- **LocalStorage Keys**: Remember the inconsistency - most use 'foodmapper_' prefix except disclaimer
- **Language Selection**: MedicalDisclaimer has its own language selector - don't duplicate in Header
- **Notification Permissions**: Water reminder uses real browser prompts - handle denied state gracefully
- **Seasonal Data**: Food IDs 4,5,7,8,9,10 have specific month arrays - don't hardcode numbers