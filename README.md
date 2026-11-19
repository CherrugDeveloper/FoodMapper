## 🎨 Bug Fixes (v2.12.111)

- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts
- **Vitest configuration**: Updated pool strategy from 'vmThreads' to 'forks' for improved stability and to resolve Vitest 5 module binding issues
- **i18n test structure**: Refactored translation map structure and enhanced language parameter handling for better test reliability
- **Calculator results verification**: Added comprehensive translation coverage for all supported languages in calculator results
- **Language state verification**: Improved consistency in language state verification across test cycles

## 🐛 Bug Fixes (v2.12.112)

- **ESLint**: Fixed unused 'lang' parameter in tests/e2e/i18n.spec.ts waitForFunction callback

## 🐛 Bug Fixes (v2.12.113)

- **Tests**: All 144 tests pass successfully with vitest run
- **ESLint**: Code linting passes with zero errors
- **Git**: Repository state verified and ready for version bump

## 🐛 Bug Fixes (v2.12.114)

- **Tests**: All 144 tests pass successfully with vitest run
- **ESLint**: Code linting passes with zero errors