# FoodMapper

[![Build and Deploy](https://github.com/CherrugDeveloper/FoodMapper/actions/workflows/deploy.yml/badge.svg)](https://github.com/CherrugDeveloper/FoodMapper/actions/workflows/deploy.yml)
[![E2E Tests](https://github.com/CherrugDeveloper/FoodMapper/actions/workflows/playwright.yml/badge.svg)](https://github.com/CherrugDeveloper/FoodMapper/actions/workflows/playwright.yml)

FoodMapper is a comprehensive, open-source nutrition and diet management application designed for academic reproducibility and individual wellness tracking. It provides specialized tools for diet planning, nutritional calculation, and lifestyle tracking with a focus on FODMAP sensitivity management.

## 🚀 Features

- **Diet Planner**: Advanced multi-phase diet planning with interactive calendar and meal tracking.
- **Nutritional Calculator**: Scientific calorie and macro-nutrient calculations using the Mifflin-St Jeor equation and EFSA standards.
- **Diary & Progress**: Daily food logging with localized search and nutritional breakdown.
- **Recipe Management**: Curated recipes with allergen filtering and FODMAP guidance.
- **Health Suite**: Sleep tracking, medication reminders, and workout planning integrations.
- **Multilingual Support**: Fully localized in English, Italian, German, Spanish, and French.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)
- **Internationalization**: [i18next](https://www.i18next.com/)

## 📋 Prerequisites

- Node.js >= 20.x
- npm >= 10.x

## 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CherrugDeveloper/FoodMapper.git
   cd FoodMapper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Development server**:
   ```bash
   npm run dev
   ```

4. **Production build**:
   ```bash
   npm run build
   ```

## 🧪 Testing

The project maintains high coverage through both unit and end-to-end tests:

- **Unit/Integration Tests**: `npm run test:run`
- **E2E Tests**: `npm run test:e2e`
- **Linting**: `npm run lint`

## 📋 Changelog Viewer

The changelog viewer includes a search bar to filter entries by version, date, or content, and category filter buttons to narrow results by Features, Fixes, or Improvements. A filter summary shows how many entries match your criteria, and an empty state appears when no results are found.

## 🎨 Bug Fixes (v2.12.86)

- **AppContext**: Restore `useMemo` wrapper around `useDietPlan()` that was accidentally removed, which could trigger infinite re-render loops. The hook must remain wrapped per AGENTS.md rule.

## 🎨 Bug Fixes (v2.12.85)

- **AppContext**: Wrapped `useDietPlan()` in `useMemo()` to prevent infinite re-render loop, ensuring stable dietPlan identity and proper cascading recalculation when nutritional requirements change.

## 🎨 Bug Fixes (v2.12.80-v2.12.79)

- **Day Navigator**: Removed automatic mount navigation to today to preserve custom start dates and prevent unintended view resets.

## 🎨 Recent UI/UX Improvements (v2.12.75)

- **Header**: App icon now spans full height of title+version lines; removed gap between title and version; left/right alignment fixed.
- **Nutritional Calculator**: Removed duplicate allergen labels; added wrappers for diet goal and meal count sections to prevent button compression; InfoPopup buttons repositioned after label text with accent-colored styling; gradient warning triangles for meal counts (1&7 orange, 2&6 medium/medium, 3&5 none, 4 recommended).
- **Diet Plan**: Fixed invalid 'yellow' severity — counts 2 and 6 now use 'medium' severity; counts 1 and 7 show orange warning triangles.
- **Italian translation**: Replaced unclear "riduce la compliance" with "riduce la capacità di seguire il piano alimentare" for meal count 7 warning.
- **Day Navigator**: Phase styling switched from background colors to border colors; Pre-inizio uses neutral gray border distinct from Fase 0 sky border.
- **Meal Card**: Added "Annulla conferma" (unconfirm) capability; confirmed meals now show an interactive button instead of a static badge.

## 📖 Reproducibility & Research

This project is designed with academic reproducibility in mind. All nutritional calculations are documented in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts) and validated against EFSA guidelines. The core logic for the FODMAP elimination phase follows established clinical protocols.

For detailed development patterns, refer to [`AGENTS.md`](AGENTS.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
