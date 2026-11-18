## [2.12.109] - 2026-11-18
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts
### Changed
- **Vitest configuration**: Updated pool strategy from 'vmThreads' to 'forks' for improved stability and to resolve Vitest 5 module binding issues
- **i18n test structure**: Refactored translation map structure and enhanced language parameter handling for better test reliability
- **Calculator results verification**: Added comprehensive translation coverage for all supported languages in calculator results
- **Language state verification**: Improved consistency in language state verification across test cycles
## [2.12.108] - 2026-11-18
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts
### Changed
- **Vitest configuration**: Updated pool strategy from 'vmThreads' to 'forks' for improved stability and to resolve Vitest 5 module binding issues
- **i18n test structure**: Refactored translation map structure and enhanced language parameter handling for better test reliability
- **Calculator results verification**: Added comprehensive translation coverage for all supported languages in calculator results
- **Language state verification**: Improved consistency in language state verification across test cycles