# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [2.12.33] - 2026-11-07

### Fixed
- **InfoPopup**: Resolved initial render positioning flash and jitter by keeping tooltips hidden (`visibility: hidden`, `opacity: 0`) until viewport positioning is fully computed via double `requestAnimationFrame`.
- **Navigation**: Strengthened tab navigation in [`src/utils/navigation.ts`](src/utils/navigation.ts) and [`src/App.tsx`](src/App.tsx) with duplicate path checks and race condition prevention.
- **Localization**: Regenerated all info popup texts across translation files (`it`, `en`, `de`, `es`, `fr`) into clean, professional prose without raw key prefixes.

### Added
- Comprehensive automated test and production build validation.
