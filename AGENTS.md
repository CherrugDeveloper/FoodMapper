# IBS Nutrition App - AGENTS.md

## Non-Obvious Project Information

### GitHub Pages Configuration
- **vite.config.ts**: `base: './'` is correct for GitHub Pages project site
  - This ensures proper routing for single-page applications deployed to GitHub Pages
  - Do NOT change to '/' unless you're deploying to the root domain

### GitHub Workflow Issues
- **ci.yml**: `ubuntu-26` is invalid - use `ubuntu-latest` or `ubuntu-24.04`
  - Current: `runs-on: ubuntu-26` (appears in all jobs: lint, typecheck, unit, build, e2e, deploy-preview)
  - Fix: Change to `ubuntu-latest` for latest stable Ubuntu or `ubuntu-24.04` for specific version

- **deploy-production.yml**: Node version inconsistency
  - Build job uses Node 24: `node-version: '24'`
  - Deploy job uses Node 20: `node-version: '20'`
  - Fix: Use consistent Node version (prefer 24 for latest features)

### LocalStorage Usage
- **MedicalDisclaimer**: Uses `localStorage.ibs_disclaimer_accepted` for acceptance gate
  - Key: `'ibs_disclaimer_accepted'` (note: no prefix like other storage)
  - Value: `'true'` when accepted
  - This bypasses the disclaimer on subsequent visits

- **i18next**: Caches language in `localStorage.i18nextLng`
  - Key: `'i18nextLng'` (set by i18next-browser-languagedetector)
  - Used for language persistence across sessions
  - Do NOT override this key manually

### Tailwind v4 Specifics
- **index.css**: Uses `margin-block-end` for space-y-* utilities
  - Tailwind v4 uses logical properties instead of margin-top/margin-bottom
  - Classes like `space-y-*` apply `margin-block-start` and `margin-block-end`
  - This affects vertical spacing in components

### Component-Specific Behaviors
- **MedicalDisclaimer**: Has its own language selector before Header renders
  - Language select appears inside the disclaimer modal
  - This allows language selection before the main app loads
  - Do NOT move language selector to Header component

- **Water Reminder**: Uses `Notification.requestPermission()` with real Chrome prompt
  - Triggered from Diary component
  - Shows actual browser permission dialog
  - Must handle both granted and denied states

### Food Data & Seasonality
- **Season data**: Uses food IDs 4,5,7,8,9,10 for seasonal filtering
  - ID 4: Aglio e Cipolla (Garlic and Onion) - months: [6,7,8,9,10]
  - ID 5: Zucchine (Zucchini) - months: [5,6,7,8,9]
  - ID 7: Carciofi e Scalogno (Artichokes and Shallots) - months: [1,2,3,4,5,10,11,12]
  - ID 8: Mele e Pere (Apples and Pears) - months: [1,2,8,9,10,11,12]
  - ID 9: Fragole e Mirtilli (Strawberries and Blueberries) - months: [4,5,6,7,8,9]
  - ID 10: Anguria (Watermelon) - months: [6,7,8,9]

### Search Functionality
- **FoodFilter**: Search matches both `t('foods.{id}.name')` and raw `food.name`
  - Primary search: `translatedName = t('foods.{food.id}.name')`
  - Fallback search: `food.name.toLowerCase()`
  - This provides bilingual search capability
  - Do NOT remove either search condition

### Storage System
- **src/utils/storage.ts**: Uses `STORAGE_PREFIX = 'foodmapper_'` for most storage
  - Keys are prefixed: `foodmapper_calc_results`, `foodmapper_user_data`, etc.
  - Exception: `ibs_disclaimer_accepted` has no prefix
  - This inconsistency must be maintained

### Build & Deployment
- **Manual deployment**: Use `npm run build` for production builds
- **GitHub Pages**: Configure with `base: './'` in vite.config.ts
- **Preview deployments**: Use pull_request triggers for preview URLs