# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.83] - 2026-11-14

### Added
- **Day Navigator**: Add Today ("Oggi") badge indicator on current date cell in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:284).

### Changed
- **Day Navigator**: Refine selected weekend day styling in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:335) combining accent selection border (`border-2 border-(--accent)`) with red weekend ring (`ring-2 ring-red-500`) to ensure selection clarity on weekend cells.

## [2.12.82] - 2026-11-14

### Fixed
- **Day Navigator / PWA**: Add time-based rapid click (double-tap / double-click) tracking (`lastClickInfoRef` with 400ms threshold) and `detail === 2` fallback in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:528) to ensure trackpad and PWA standalone mode double-clicks successfully update the diet start date.

## [2.12.81] - 2026-11-14

### Fixed
- **Day Navigator / Diet Plan**: Fix diet start date synchronization between `useDietPlan` updateStartDate and `AppContext` dietStartDate / `dietStartDateStorage` so double-clicking a day in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:534) correctly persists and sets the diet start date.

## [2.12.80] - 2026-11-14

### Fixed
- **Day Navigator**: Remove automatic mount navigation to today to preserve custom start dates and prevent unintended view resets

## [2.12.79] - 2026-11-13

### Fixed
- Fix `useDietPlan.updateStartDate` to correctly regenerate days directly for the new start date instead of relying on cached memoized fallback

## [2.12.78] - 2026-11-13

### Fixed
- Fix calendar view synchronization after double-clicking a day cell in `DayNavigator.tsx` to update diet start date
- Fix pre-start badge in `PhaseProgress.tsx` to display negative integer indicating days remaining until diet start date

## [2.12.77] - 2026-11-13

### Fixed
- Fix DayNavigator.tsx hover losing phase background color on non-selected cells by reducing hover opacity to 50%
- Fix PhaseProgress.tsx Pre-inizio badge scope bug: `isPreStart` was referenced outside its defining `useMemo`, causing "Giorno 0/7" to render instead of neutral "Pre-inizio"
- Fix ITALIAN_HOLIDAYS missing `const` declaration in DayNavigator.tsx

### Changed
- Extract memoized `DayCell` component from DayNavigator.tsx inline rendering so each calendar cell re-renders independently instead of the whole grid on every state change

### Added
- Regression test for double-click start date view sync in `tests/uiChanges.test.tsx`: verifies calendar view navigates to new start date's month after double-click and phase colors render in current month grid

## [2.12.76] - 2026-11-13

### Fixed
- Fix phase 0 days disappearing when changing diet start date in `useDietPlan.updateStartDate`; days now always generate from dayIndex 0 while `currentDayIndex` still lands navigation on today's position

## [2.12.75] - 2026-11-13

### Fixed
- Fix Header icon height to span both title and version lines; remove space between title and version
- Fix DietPlan warning triangle severity: counts 2 and 6 now correctly show yellow instead of invalid 'yellow' type
- Fix Italian translation: replace unclear "riduce la compliance" with "riduce la capacità di seguire il piano alimentare"
- Remove duplicated calc_allergens_title labels from NutritionalCalculator; fix compressed diet goal and meal count buttons

## [2.12.74] - 2026-11-13

### Changed
- Add app icon (`favicon.svg`) and version badge (`v2.12.73`) to Header for improved visual identity.
- Improve InfoButton thematic concordance in NutritionalCalculator with accent-colored buttons matching adjacent UI elements.
- Implement gradient warning triangle system for meal count buttons: 1 & 7 meals = orange, 2 & 6 meals = yellow, 3 & 5 meals = none, 4 meals = recommended.
- Reposition InfoPopup immediately after label text instead of end-of-row justification in NutritionalCalculator.
- Remove redundant pill badge from DietPlan and switch meal count buttons to single-row flex layout.
- Replace phase background colors with phase border colors in DayNavigator; Pre-inizio uses neutral gray border distinct from Fase 0 sky border.
- Add `unconfirmMeal` capability to useDietPlan hook and MealCard component; confirmed meals now show an interactive "Annulla conferma" button instead of static badge.

## [2.12.73] - 2026-11-12

### Fixed
- Fix i18n race condition in `src/main.tsx` by requiring all preloaded language bundles ('it', 'en', 'de', 'es', 'fr') to be loaded before rendering, preventing raw translation keys when switching locales.
- Remove debug `console.log` statements from `src/i18n.ts` and `src/main.tsx`.

### Added
- Enhance Changelog viewer (`src/components/Changelog.tsx`) with search input, category filter buttons (All/Features/Fixes/Improvements), filter result summary, empty state, and clear search functionality.

## [2.12.72] - 2026-11-12

### Fixed
- Resolve infinite re-render loop in `AppContext.tsx` by wrapping `useDietPlan()` in `useMemo`, preventing `dietPlan` identity churn from triggering `regenerateDays()` on every render cycle.
- Resolve i18n raw translation strings for German, Spanish, and French locales by adding `preload: ['it', 'en', 'de', 'es', 'fr']` to i18next init configuration, ensuring all language bundles are fetched via HttpBackend.

### Removed
- Remove `checkTranslationsDirectly()` function and associated debug logging from `src/main.tsx`.
- Remove debug `console.log` statements from `src/utils/navigation.ts`.

## [2.12.71] - 2026-11-12

### Fixed
- Add ArrowLeft/ArrowRight keyboard navigation support to `DayNavigator`, enabling prev/next day traversal via keyboard.
- Prevent navigation state corruption from `app-navigation` event listener by registering it after context hooks are initialized and cleaning up on unmount.
- Resolve navigation UI freeze in `DietPlan` via `app-navigation` event listener with proper cleanup, preventing block-scoped variable errors.
- Ensure `app-navigation` event triggers in JSDOM test environment by manually invoking target listeners on `window.dispatchEvent`.

### Changed
- Update `AGENTS.md` with strict rules for event listener registration and cleanup patterns in React components.
- Update documentation, version, and configuration files.

## [2.12.70] - 2026-11-12

### Fixed
- Resolve navigation UI freeze in `DietPlan.tsx` by ensuring the `app-navigation` event listener is registered after context hooks are initialized, preventing block-scoped variable errors.
- Correct JSDOM test environment behavior for custom events by ensuring `window.dispatchEvent` mocks trigger listeners synchronously.
- Resolve navigation button responsiveness issues in `DietPlan` component after route transitions.

### Changed
- Refactor `navigateTo` utility to remove redundant `fallback` options and optimize internal state management.
- Update `AGENTS.md` with strict rules for event listener registration and cleanup patterns in React components.

### Removed
- Unused `touchNavigationTime` utility and associated imports to improve bundle size and maintainability.

## [2.12.69] - 2026-11-12

### Changed
- Standardize documentation and configuration for automated git workflows.

## [2.12.68] - 2026-11-11

### Fixed
- Resolve stale event listener issues in navigation logic preventing correct UI updates.

### Added
- Document event listener patterns in `AGENTS.md` to prevent future regressions in component lifecycle management.

## [2.12.67] - 2026-11-11

### Fixed
- Resolve navigation throttle blocking that was freezing UI buttons in `DietPlan` and main navigation tabs.
- Prevent navigation blocking after reaching the diet view by resetting internal throttle states.

## [2.12.66] - 2026-11-10

### Fixed
- Resolve stale closure and infinite update loops in `DietPlan` hooks and context.
- Fix navigation delays and keyboard blocking in `DietPlan` and `DayMetaModal` components.

## [2.12.63] - 2026-11-10

### Fixed
- Resolve React 19 stale closure bugs in `DietPlan` view navigation using ref patterns for callbacks.
- Fix date parsing bugs and `useEffect` synchronization loops in `DayNavigator.tsx`.

## [2.12.60] - 2026-11-09

### Added
- Comprehensive navigation test location provider with `ancestorOrigins` support for better test environment detection.

### Fixed
- Resolve `DayNavigator` import issues and TypeScript type errors in `DietPlan.tsx`.
- Refresh `recentDays` after reset actions in Diary and Diet Plan views.

## [2.12.53] - 2026-11-09

### Fixed
- Resolve SPA deep-linking 404 errors by improving base path handling and `i18next` re-initialization logic.
- Fix scroll reset and date initialization in PWA standalone mode.

## [2.12.51] - 2026-11-08

### Changed
- Refactor `DayNavigator` with timezone safety and accessibility improvements.
- Redesign `DayNavigator` with interactive monthly calendar grid and Monday start.

## [2.12.40] - 2026-11-08

### Added
- Weight-dependent EFSA caffeine calculations in `NutritionalCalculator`.
- Weekend badges and exclusive phase background colors in calendar views.

### Fixed
- Resolve `InfoPopup` nesting issues and improve allergen contrast.
- Fix date clamping and event propagation in `DayNavigator`.

## [2.12.39] - 2026-11-08

### Fixed
- Synchronize missing translation key `info.diet_meal_count` across locale bundles.

## [2.12.38] - 2026-11-08

### Fixed
- Update changelog for v2.12.38 release.

## [2.12.36] - 2026-11-08

### Changed
- Optimize `DayNavigator` and `PhaseProgress` performance with sliding window generation.

## [2.12.35] - 2026-11-08

### Fixed
- Resolve undefined `foodEntries` TypeError and update changelog for v2.12.35.

## [2.12.33] - 2026-11-07

### Fixed
- Restore `totalPhaseDays` definition in `PhaseProgress.tsx` for typecheck success.
- Remove unused variables and fix no-useless-assignment in `PhaseProgress.tsx`.

## [2.12.31] - 2026-11-07

### Fixed
- Update documentation, changelog, and component bug fixes.

## [2.12.30] - 2026-11-07

### Changed
- Update documentation, changelog, and `NutritionalCalculator` i18n/caffeine calculator.

## [2.12.28] - 2026-11-07

### Fixed
- Fix `DayNavigator` calendar and `PhaseProgress` component calculations.

## [2.12.27] - 2026-11-07

### Added
- Refactor `DayNavigator` colors, weekend styling, reminders, PWA headless mode, and `PhaseProgress`.

### Changed
- Refactor `DayNavigator` with strict month grey-out, phase background tinting, independent weekend styling, and saint/moon phase enrichment.

### Fixed
- Fix `phaseDay` calculation, calendar phase background styling/legend, `DayNavigator` performance, and `PhaseProgress` counters.

## [2.12.21] - 2026-11-07

### Fixed
- Resolve PhaseProgress visibility, pre-start states, and build validation.
- Resolve pre-start phase badge, counter interpolation, sluggish selection, and PhaseProgress layout.

## [2.12.19] - 2026-11-07

### Added
- Enable past navigation, month controls, and infinite maintenance phase in `DayNavigator`.

### Changed
- Enhance UI components, `DayNavigator` month navigation, Toast centering, and dynamic PhaseProgress duration.

## [2.12.16] - 2026-11-07

### Fixed
- Refactor phase progress, toast notification fixes, day counters optimization, and navigation race condition resolution.

## [2.12.15] - 2026-11-06

### Fixed
- Resolve tab switching race conditions, toast notifications, and weekend highlighting.
- Reposition recipe button in `MealCard` for better UX.

### Removed
- Remove invalid actions/delete-artifact step from CI workflow.

## [2.12.13] - 2026-11-06

### Added
- Redesigned `DayNavigator` with full week multiples and prominent holiday indicators.

## [2.12.12] - 2026-11-06

### Added
- Redesigned `DayNavigator` with week-per-row layout, expanded meal count selector.

## [2.12.11] - 2026-11-06

### Changed
- Automated release and repository maintenance.

## [2.12.10] - 2026-11-06

### Changed
- Automated release and repository maintenance.

## [2.12.9] - 2026-11-06

### Fixed
- Fix e2e test startup timeout in `playwright.config.ts`.
- Correct YAML indentation in e2e job.
- Fix disclaimer acceptance race condition and modal re-attachment in CI.

### Changed
- Update Playwright container image version to v1.64.1-noble.

## [2.12.8] - 2026-11-06

### Fixed
- Fix InfoPopup PWA portable positioning with fixed coords and improve allergen button contrast.
- Update `FodmapDetailsProps` to accept `string | null` for `foodId`.

### Changed
- Optimize CI Playwright browser caching and installation.

## [2.12.7] - 2026-11-06

### Fixed
- Fix InfoPopup PWA portable positioning with fixed coords and improve allergen button contrast.

### Changed
- Update CHANGELOG, README, CI workflow, and version according to Keep a Changelog 1.1.0.

## [2.12.5] - 2026-11-05

### Fixed
- Resolve lint error and update version to 2.12.4.
- Remove header and fix InfoPopup viewport positioning.
- Fix Playwright browser installation timeout and non-interactive apt-get.
- Resolve info popup not appearing on hover or click by fixing tooltip positioning and state dependency.
- Correct Italian typo "Avviso AI".
- Resolve UI components and workflow issues across calculator, diet plan, recipes, shopping list, and workout plan.
- Resolve E2E test failures in shard 2/3 and update test assertions.
- Enable sourcemap generation and update i18n translations.
- Enable sourcemap generation for production builds.
- Complete German translation file with all 1425+ keys matching English structure.
- Complete Italian translation file with all 1425+ keys matching English structure.
- Fix InfoPopup touch handling on iOS, update i18n translation structure, and fix Diary responsive horizontal cutting.
- Address npm audit warnings and install scripts.
- Add missing `medication_recognition_button` translation keys.
- Remove unused `setHorizontalShift` reference.

## [2.12.3] - 2026-11-05

### Fixed
- PWA translation caching and InfoPopup mobile fixes.
- Resolve InfoPopup and translation caching issues on portable devices.
- Add missing translation keys `diet_view_recipe` and `diet_recipe` for es and fr.

### Changed
- Update CHANGELOG, README, and version.

## [2.12.0] - 2026-11-05

### Added
- Include all changes for v2.12.0 release.

## [2.11.3] - 2026-11-05

### Changed
- Update package-lock.json for v2.11.3.

## [2.11.2] - 2026-11-05

### Changed
- Fix CI workflow shard and result paths.

## [2.11.1] - 2026-11-05

### Changed
- Update package-lock.json for v2.11.1.
- Update CHANGELOG, README hints, package.json version, and CI workflow.

## [2.10.0] - 2026-11-03

### Added
- Add medication reminder functionality with notification scheduling.

### Fixed
- Add missing imports in `MedicationSelector` for `detectMedicationsWithBrands` and InfoPopup.
- Resolve ESLint errors in `MedicationSelector`, `ShoppingList`, and `useShoppingList`.
- Resolve ESLint error and improve navigation reliability.
- Fix CI: update GitHub Actions versions for Node.js 24 compatibility.
- Fix CI: update actions to support Node.js 24.
- Fix CI: update workflow actions to v7/v8 versions.

### Changed
- Update vite-plugin-pwa to v2.0.0 and resolve npm deprecation warnings.

## [2.9.0] - 2026-10-29

### Fixed
- Resolve tab switching navigation and hide scrollbars.
- Resolve AppContext TypeScript error and refine InfoPopup alignment.

### Changed
- Bump actions/upload-pages-artifact to @v4 to suppress Node 20 deprecation warnings.
- Remove obsolete plan documents and root screenshot artifacts.

## [2.8.9] - 2026-10-28

### Fixed
- Restore hover delay for InfoPopup to prevent instant close on mouse leave.

### Changed
- Update CHANGELOG.md with InfoPopup hover fix.

## [2.8.8] - 2026-10-20

### Changed
- Add debug logging to AppContext and main, clean up obsolete auto-git script.

## [2.8.3] - 2026-10-19

### Fixed
- Fix medical disclaimer role and session latch.

## [2.8.0] - 2026-10-18

### Fixed
- UI freeze fix, 404.html routing fallback.

### Changed
- UI component refactorings, changelog updates, version bump.

## [2.7.7] - 2026-10-15

### Fixed
- Restore `check_keys.cjs` and update changelog.

### Changed
- Cleanup obsolete scripts, artifacts, and unused skill files.

## [2.7.6] - 2026-10-15

### Changed
- Clean up deployment workflows, optimize CI config.

## [2.7.4] - 2026-10-15

### Changed
- Remove redundant ci-cd.yml workflow.

## [2.7.3] - 2026-10-15

### Fixed
- Update i18n detection order expectation to match localStorage-first configuration.

## [2.7.2] - 2026-10-15

### Fixed
- Remove header symbols, fix language auto-detection, changelog badge, developer card version.

## [2.7.1] - 2026-10-15

### Fixed
- Update diet-plan selector and E2E fixtures.

## [2.6.2] - 2026-10-02

### Added
- Add chickpea flour and missing food entry.
- Add developer card redesign plan.
- Add share modal component.
- Add community engagement header row.
- Add PayPal SDK error fallback.
- Add share functionality and community buttons.

### Fixed
- Remove performance modal translations and fix JSON formatting.
- Restructure `MedicalDisclaimer` component.
- Simplify `Header` component.
- Update Italian, French, Spanish, English, and German translations.

## [2.6.1] - 2026-10-01

### Added
- Add performance modal with translations.
- Add header badge.

### Changed
- Update navigation tabs styling.

## [2.6.0] - 2026-09-30

### Added
- Adds test e2e UI and CI test scripts.
- Add vitest debug configuration for single test file runs.
- Add timing logs and localStorage cleanup to diary e2e tests.

### Fixed
- Fix Diary test imports and add `targetCaloriesKcal` to mock data.
- Remove committed test result artifacts.
- Stabilizes E2E tests across all browsers.

### Changed
- Configure Playwright retries and worker count.
- Re-renders active tab highlight on popstate.
- Translate Italian disclaimer title.

## [2.4.0] - 2026-09-29

### Added
- Adds update changelog skill doc.
- Notifies ErrorBoundary errors with Toast.
- Improves PWA caching in vite config.
- Adds AI-generated content disclosures.
- Adds multilingual health education articles.
- Adds estimated shopping costs.
- Adds personalized workout planning.
- Adds recipe browsing and detail pages.
- Adds FODMAP food details.
- Adds sleep tracking and localized sleep screens.
- Adds reusable toast notifications.

### Fixed
- Fixes Rules of Hooks violations across components.
- Refactors `calculateTotalNutrition`, adds memoize.
- Refactors `useFoodSearch`, removes `useMemo`, adds `isLoading`.
- Fix `MedicalDisclaimer` useState initialization.
- Remove unused Header changelog callback.
- Removes duplicate calculator width utility.
- Simplifies InfoPopup size utilities.
- Avoids an unused Header props warning.

### Changed
- Prioritizes browser language detection.
- Hardens translation audit checks.
- Improves responsive component layouts.
- Corrects diabetes-effect translations.
- Saves calculator drafts automatically.
- Improves developer support information.
- Uses relative paths for app assets.
- Updates GitHub artifact actions to v6.
- Improves InfoPopup touch support.
- Removes coverage artifact upload.
- Removes duplicate medication therapy label.
- Refines InfoPopup behavior and styling.
- Improves responsive calculator controls.
- Clarifies calculator translations.
- Updates app branding to FoodMapper.
- Updates project workflow guidance.
- Adjusts nutrition targets for medications.
- Adds medication therapy configuration.
- Improves responsive calculator layout.
- Improves info popup hover behavior.

## [2.2.1] - 2026-09-28

### Added
- Adds version 2.2.1 changelog.
- Adds sortable changelog entries.
- Updates PWA manifest assets.

### Fixed
- Removes duplicate medication therapy label.
- Refines InfoPopup behavior and styling.

### Changed
- Improves responsive calculator controls.
- Clarifies calculator translations.
- Updates app branding to FoodMapper.
- Updates project workflow guidance.
- Adds release changelog and update guidance.
- Adjusts nutrition targets for medications.
- Adds medication therapy configuration.
- Improves responsive calculator layout.
- Improves info popup hover behavior.
