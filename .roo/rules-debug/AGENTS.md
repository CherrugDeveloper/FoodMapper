# IBS Nutrition App - Debugging-Specific Rules

## Common Debugging Scenarios

### LocalStorage Issues
- **Disclaimer Loop**: If disclaimer keeps appearing, check `localStorage.ibs_disclaimer_accepted` is set to `'true'` (string, not boolean)
- **Language Persistence**: i18next language stored in `localStorage.i18nextLng` - don't manually override
- **Storage Prefix Confusion**: Most storage uses `foodmapper_` prefix, but disclaimer uses `ibs_disclaimer_accepted` without prefix

### i18n Debugging
- **Initialization Race**: MedicalDisclaimer shows loading spinner while i18n initializes - check `i18n.isInitialized`
- **Language Detection Order**: Priority: localStorage → navigator → htmlTag
- **Missing Translations**: Check public/locales/ for JSON files; fallback to English if Italian missing

### Notification/Permission Issues
- **Water Reminder**: Uses real `Notification.requestPermission()` - check browser permission settings
- **Denied State**: Handle gracefully - reminder won't retry until page reload
- **Unsupported Browsers**: Check `'Notification' in window` before requesting permission

### Seasonal Data Bugs
- **Food IDs 4,5,7,8,9,10**: These have specific month arrays for seasonal filtering
- **Null/Undefined months**: Foods without `months` property are available year-round
- **Month Numbers**: 1-12 (January-December), not 0-11

### Search Functionality Issues
- **Bilingual Search**: FoodFilter searches both `t('foods.{id}.name')` AND raw `food.name`
- **Missing Translations**: Falls back to raw food.name if translation missing
- **Case Insensitive**: Both searches use `.toLowerCase()`

### Tailwind v4 Specific Issues
- **Logical Properties**: `space-y-*` uses `margin-block-start/end`, not `margin-top/bottom`
- **RTL Considerations**: Logical properties adapt to text direction
- **CSS Variables**: Colors defined in `:root` as `--text`, `--bg`, etc.

### Build/Deployment Problems
- **GitHub Pages Base**: `vite.config.ts` base must be `'./'` for project sites
- **Node Version Mismatch**: Ensure consistent Node version across workflows (use 24)
- **Ubuntu Version**: `ubuntu-26` invalid - use `ubuntu-latest` or `ubuntu-24.04`

### Testing Debug Tips
- **Test IDs**: Use `data-testid` attributes for reliable selectors
- **Mocking**: Vitest provides built-in mocking for modules and browser APIs
- **E2E Selectors**: Playwright tests use data-testid or text content, not CSS selectors
- **Accessibility**: Axe-core violations appear in test output - fix semantic HTML issues

### Performance Debugging
- **Bundle Analysis**: Check `dist/stats.html` after `npm run build`
- **Memoization**: Overuse of useMemo/useCallback can hurt performance
- **Image Optimization**: Large assets in src/assets/ automatically optimized
- **Chunking**: Vite config splits vendor/feature/utils - don't modify chunks unnecessarily

### Error Boundaries
- **ErrorBoundary Component**: Wraps risky components to prevent app crashes
- **Console Errors**: Check for red error boundaries in UI
- **Fallback UI**: Shows user-friendly error message with retry option

### Context API Issues
- **AppContext Provider**: Must wrap components that consume context
- **useAppContext Hook**: Custom hook for type-safe context access
- **Stale Closure**: Be careful with dependencies in useEffect when using context values