# FoodMapper: Computational Low-FODMAP Dietetics & Microbiome Health Platform

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-yellow?logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.64-green?logo=playwright)](https://playwright.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange?logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 1. General Information & Computational Context

- **Application Name**: FoodMapper
- **Current Version**: `2.12.56`
- **Release Date**: 2026-11-09
- **Live Deployment**: [https://cherrugdeveloper.github.io/FoodMapper/](https://cherrugdeveloper.github.io/FoodMapper/)
- **Repository**: [https://github.com/cherrugdeveloper/FoodMapper](https://github.com/cherrugdeveloper/FoodMapper)
- **Primary Domain**: Clinical Dietetics, Irritable Bowel Syndrome (IBS) Symptom Management, Metabolic Nutrition Modeling, and Gastrointestinal Health Research.
- **License**: GNU General Public License v3.0 ([`LICENSE`](LICENSE:1)).

FoodMapper is an offline-first, client-side Progressive Web Application (PWA) designed to provide deterministic, reproducible dietary computation for individuals managing Irritable Bowel Syndrome (IBS), Small Intestinal Bacterial Overgrowth (SIBO), and related functional gastrointestinal disorders. The platform integrates:
1. **Four-Phase Elimination & Reintroduction Protocol**: Structured implementation of the Monash University clinical low-FODMAP dietary framework.
2. **Computational Energy & Macronutrient Modeling**: Deterministic calculation of Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) via the Mifflin-St Jeor equation, with dynamic portion scaling.
3. **Bilingual Semantic Food Database**: Rapid bilingual search engine matching raw database entities and localized taxonomic translations across Italian, English, German, Spanish, and French.
4. **Holistic Lifestyle Integration**: Synchronized symptom logging, sleep hygiene tracking, structured physical activity scheduling, and medication interaction warnings.
5. **Zero-Telemetry Client-Side Storage**: Complete privacy and data sovereignty; all health logs, biometric measures, and dietary schedules remain encrypted in local browser storage (`localStorage` / `IndexedDB`).

---

## 2. Computational Reproducibility & System Requirements

To ensure identical execution, computational reproducibility, and verifiable builds across distinct research environments and operating systems, adhere to the specified software matrix.

### 2.1 Hardware and Operating System Requirements
- **Tested Operating Systems**:
  - Linux: Ubuntu 22.04 LTS / 24.04 LTS, Debian 12, Arch Linux (Kernel >= 6.x)
  - macOS: macOS 13 (Ventura), 14 (Sonoma), 15 (Sequoia) on Apple Silicon (M1/M2/M3) and Intel x86_64
  - Windows: Windows 10 / 11 (tested on WSL2 Ubuntu and native PowerShell 7)
- **Minimum Hardware**:
  - CPU: Dual-core x86_64 or ARM64 processor (2.0 GHz or higher)
  - Memory (RAM): Minimum 4 GB RAM (8 GB recommended for parallel Playwright e2e test runs)
  - Disk Space: 1.5 GB available storage (for repository, `node_modules`, and test traces)

### 2.2 Software Runtime & Toolchain
- **Node.js**: `v20.x` LTS or `v22.x` LTS (Active LTS recommended, minimum `v18.18.0`)
- **Package Manager**: `npm` `v10.x` or higher (bundled with Node.js)
- **TypeScript**: `5.6.x` (configured in [`tsconfig.app.json`](tsconfig.app.json:1))
- **Bundler & Build Tool**: Vite `8.3.x` with `@vitejs/plugin-react` `5.2.x` and `@tailwindcss/vite` `4.3.x`
- **Testing Runtimes**: Vitest `5.0.x` (jsdom environment `30.1.x`) and Playwright `1.64.x`

---

## 3. Installation, Setup & Deterministic Environment

To reproduce the exact computational environment without version drift, always utilize [`package-lock.json`](package-lock.json:1) with `npm ci`.

### 3.1 Step-by-Step Setup Instructions

```bash
# 1. Clone the repository from GitHub
git clone https://github.com/cherrugdeveloper/FoodMapper.git

# 2. Navigate to the project root directory
cd FoodMapper

# 3. Cleanly install pinned dependencies from package-lock.json
npm ci

# 4. Verify TypeScript compilation and workspace typing integrity
npx tsc -b

# 5. Run static lint analysis
npm run lint
```

### 3.2 Running the Development Server

To launch the local Vite development environment with Hot Module Replacement (HMR):

```bash
npm run dev
```
The application will be accessible at `http://localhost:5173/FoodMapper/` (or `http://localhost:5173/` depending on local port binding).

---

## 4. Execution Workflow, Validation & Testing

FoodMapper includes a comprehensive quality assurance and validation suite spanning static analysis, unit testing, integration tests, and end-to-end browser workflows.

### 4.1 Available Validation Scripts

| Script Command | Target / Process | Description |
|---|---|---|
| `npm run dev` | Development Server | Starts Vite dev server with client-side routing fallback |
| `npm run build` | Production Build | Runs `tsc -b` type-checking followed by Vite Rollup bundle generation |
| `npm run preview` | Production Preview | Locally serves production build from `dist/` |
| `npm run lint` | ESLint Analysis | Enforces TypeScript strict rules, React Hooks rules, and formatting |
| `npm test` | Vitest Watcher | Runs interactive unit test suite with instant watch feedback |
| `npm run test:run` | Vitest Single Run | Executes full unit and integration test suite once (90+ tests) |
| `npm run test:e2e` | Playwright E2E | Runs headless browser end-to-end tests across Chromium, Firefox, WebKit |
| `npm run test:e2e:ui` | Playwright UI Mode | Opens interactive Playwright UI for visual stepping and debugging |
| `npm run test:ci` | CI Pipeline Runner | Headless line-reported test run suitable for continuous integration |

### 4.2 Executing the Full Test Pipeline

To verify computational reproducibility locally:

```bash
# Execute lint check, unit tests, and production build sequentially
npm run lint && npm run test:run && npm run build
```

---

## 5. Directory Structure & Architecture Manifest

Below is the repository architectural manifest, highlighting core computational and clinical modules:

```text
FoodMapper/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD deployment definitions
├── public/
│   ├── .nojekyll               # Disables Jekyll processing for GitHub Pages hosting
│   ├── 404.html                # Single-Page Application (SPA) redirect handler for deep links
│   ├── favicon.svg             # Application vector icon
│   ├── manifest.json           # Web App Manifest for Progressive Web App (PWA) installation
│   └── locales/                # Internationalization strings (en, it, de, es, fr)
│       ├── en/translation.json
│       ├── it/translation.json
│       ├── de/translation.json
│       ├── es/translation.json
│       └── fr/translation.json
├── src/
│   ├── assets/                 # Static graphical assets and vector diagrams
│   ├── components/             # User interface components and interactive widgets
│   │   ├── dietPlan/           # Modular diet plan subcomponents (DaySummary, MealCard, PhaseProgress)
│   │   ├── DayNavigator.tsx    # Monthly & daily calendar navigation, weekend borders, event triggers
│   │   ├── DeveloperCard.tsx   # System metadata, technical diagnostics, and changelog viewer
│   │   ├── Diary.tsx           # Daily food and symptom logging interface
│   │   ├── DietPlan.tsx        # Four-phase dietary orchestrator and meal plan view
│   │   ├── EducationalHub.tsx  # Clinical literacy repository with localized markdown rendering
│   │   ├── ErrorBoundary.tsx   # React runtime error boundary with graceful crash fallback
│   │   ├── FoodFilter.tsx      # Bilingual FODMAP classification search and filter
│   │   ├── Header.tsx          # Top navigation bar, language switcher, and theme toggler
│   │   ├── MedicalDisclaimer.tsx# Compulsory medical disclaimer modal gate
│   │   ├── MedicationReminder.tsx# Medication schedule alarms and food-drug interaction notices
│   │   ├── NutritionalCalculator.tsx# Interactive BMR/TDEE calculator and macro allocator
│   │   ├── Recipes.tsx         # Curated low-FODMAP recipe index and preparation instructions
│   │   ├── ShoppingList.tsx    # Dynamic ingredient aggregator derived from planned meals
│   │   ├── SleepDashboard.tsx  # Sleep quality analysis, sleep cycles, and sound generator
│   │   └── WorkoutPlan.tsx     # Physical exercise regimens adapted for digestive comfort
│   ├── content/                # Peer-reviewed scientific educational articles in multi-lingual Markdown
│   │   ├── assorbimento-meccanismi.*.md
│   │   ├── bio-hacking.*.md
│   │   ├── decodifica-fodmap.*.md
│   │   ├── fibre-microbiota.*.md
│   │   ├── mifflin-st-jeor.*.md
│   │   └── sonno-salute-metabolica.*.md
│   ├── context/                # Global React 19 state context (AppContext, useDietPlan integration)
│   ├── hooks/                  # Specialized computational and behavioral React hooks
│   │   ├── useDietPlan.ts      # Core diet state machine, day indexing, and meal portioning
│   │   ├── useFoodSearch.ts    # Dual-language bilingual search engine hook
│   │   ├── useNotificationPermission.ts # Browser notification permission lifecycle handler
│   │   └── useSleepTracking.ts # Local sleep metric calculations and circadian rhythms
│   ├── types/                  # TypeScript interface definitions (dietPlan.ts, foods, recipes)
│   ├── utils/                  # Core deterministic calculation engines and static datasets
│   │   ├── calendarHelpers.ts  # ISO date math, weekday normalization, and Italian holiday calculations
│   │   ├── changelogData.ts    # Structured changelog history for in-app display
│   │   ├── foodsData.ts        # Comprehensive database of food items with FODMAP ratings and macros
│   │   ├── mealGenerator.ts    # Deterministic meal construction, phase rotations, and slot filling
│   │   ├── medicationWarnings.ts# Drug-food interaction heuristics
│   │   ├── nutritionCalculator.ts# Memoized BMR, TDEE, macro-distribution, and nutritional scaling
│   │   ├── recipesData.ts      # Standardized recipe database with ingredient portion maps
│   │   └── storage.ts          # Typed, version-guarded localStorage persistence layer
│   ├── App.tsx                 # Root application routing and tab coordinator
│   ├── i18n.ts                 # Internationalization configuration (i18next)
│   ├── index.css               # Tailwind CSS v4 design tokens and CSS custom properties
│   └── main.tsx                # Application bootstrap and Service Worker registration
├── tests/                      # Vitest unit and integration test suite
│   ├── Diary.test.tsx          # Tests for symptom and food entry persistence
│   ├── mealGenerator.test.ts   # Tests for meal allocation, phase restrictions, and energy targets
│   ├── nutritionCalculator.test.ts# Tests for Mifflin-St Jeor math and portion multipliers
│   ├── uiChanges.test.tsx      # Tests for calendar weekend visual cues and day navigation
│   └── useDietPlan.test.ts     # Tests for immutable diet plan state transitions
├── eslint.config.js            # ESLint flat configuration file
├── package.json                # Project dependencies, scripts, and package metadata
├── package-lock.json           # Locked dependency dependency graph for bit-for-bit reproducibility
├── playwright.config.ts        # Playwright end-to-end testing configuration
├── tsconfig.app.json           # TypeScript configuration for application code
└── vite.config.ts              # Vite build setup, Tailwind v4 integration, Rollup chunk splitting
```

---

## 6. Scientific & Algorithmic Methodology

FoodMapper translates established nutritional science and clinical gastrointestinal research into deterministic client-side algorithms.

### 6.1 Energy Expenditure & Macronutrient Modeling
The nutritional calculator ([`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1)) evaluates Basal Metabolic Rate ($BMR$) via the validated **Mifflin-St Jeor equation**:

$$\text{BMR}_{\text{male}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age (y)} + 5$$

$$\text{BMR}_{\text{female}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age (y)} - 161$$

Total Daily Energy Expenditure ($TDEE$) is derived by multiplying $BMR$ by the Physical Activity Level ($PAL$) coefficient:
- Sedentary: $1.2$
- Light Activity: $1.375$
- Moderate Activity: $1.55$
- Very Active: $1.725$
- Extremely Active: $1.9$

Macronutrient targets are computationally budgeted across meal slots:
- Carbohydrates: $45\% - 55\%$ of total daily caloric quota ($4 \text{ kcal/g}$)
- Proteins: $15\% - 25\%$ of total daily caloric quota ($4 \text{ kcal/g}$)
- Lipids: $25\% - 35\%$ of total daily caloric quota ($9 \text{ kcal/g}$)

### 6.2 Low-FODMAP Phase Protocol Architecture
The meal generator ([`src/utils/mealGenerator.ts`](src/utils/mealGenerator.ts:1)) implements a four-phase protocol designed to identify dietary triggers while preserving gut microbiota diversity:
1. **Phase 0 (Strict Elimination)**: All high-FODMAP foods (oligosaccharides, disaccharides, monosaccharides, and polyols) are restricted. Only ingredients with verified green-light status are admitted into meal slots.
2. **Phase 1 (Systematic Reintroduction)**: Controlled single-group food challenges are systematically rotated across 3-day test cycles followed by 3-day washout periods:
   - Fructose (e.g., honey, mango)
   - Lactose (e.g., cow's milk, yogurt)
   - Sorbitol (e.g., avocado, blackberries)
   - Mannitol (e.g., mushrooms, cauliflower)
   - Fructans (e.g., garlic, onion, wheat)
   - Galacto-oligosaccharides / GOS (e.g., almonds, canned lentils)
3. **Phase 2 (Personalization)**: Fine-tuning portion sizes and combining tolerated groups while maintaining low exposures to identified triggers.
4. **Phase 3 (Maintenance & Microbiome Optimization)**: Maximizing dietary breadth to support microbial short-chain fatty acid (SCFA) synthesis without precipitating IBS flares.

### 6.3 Deterministic Day Indexing
Day calculations use zero-padded ISO strings (`YYYY-MM-DD`) and integer day offsets relative to `startDate`. Rather than indexing raw array offsets, day lookup uses deterministic date math:
```typescript
const targetDayIndex = getDayIndexFromDate(targetDate, state.startDate);
```
This guarantees that calendar navigation ([`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1)) and diet planning ([`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:1)) remain perfectly synchronized regardless of view window shifts.

---

## 7. Storage, Persistence & Privacy Architecture

FoodMapper adheres to the strictest principles of personal data privacy:
- **Client-Side Only**: All user data is processed and stored exclusively in the browser's `localStorage` and `IndexedDB`.
- **Zero External Telemetry**: No user inputs, symptom logs, or dietary profiles are transmitted over the network.
- **Key Partitioning**:
  - `ibs_disclaimer_accepted`: Stores gate consent (`"true"`). Note: Maintained without prefix for legacy gate verification.
  - `foodmapper_diet_plan_v3`: Serialized four-phase dietary plan state and generated meals.
  - `foodmapper_diary_v1`: Daily diary records, symptom severity scores, and meal confirmations.
  - `foodmapper_user_data`: Nutritional profile, BMR/TDEE inputs, and physical activity constants.
  - `foodmapper_calendar_meta_v1`: Custom calendar annotations, cycle tracking, and event flags.
  - `i18nextLng`: Standard internationalization language preference string.

---

## 8. Non-Obvious Implementation Gotchas

Developers and researchers contributing to or reproducing this codebase should note the following non-obvious engineering decisions:

1. **GitHub Pages Base URL Requirement**:
   In [`vite.config.ts`](vite.config.ts:1), the configuration `base: './'` is **strictly required**. Altering this value breaks asset paths and client-side history navigation on GitHub Pages deployments.
2. **SPA Deep-Link Routing**:
   Deep linking on static hosts is managed via [`public/404.html`](public/404.html:1) and [`index.html`](index.html:1), which encode and restore path parameters across route transitions.
3. **Disclaimer Gate Key**:
   The key `localStorage.ibs_disclaimer_accepted` must equal the exact string `"true"`. Do not add the `foodmapper_` prefix to this key.
4. **Bilingual Search Engine**:
   The search implementation in [`src/hooks/useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1) evaluates both the localized translation label (`t(food.name)`) and the raw key string (`food.name`) to prevent search failures across language switches.
5. **Tailwind CSS v4 Logical Spacing**:
   Tailwind CSS v4 utilizes CSS logical properties. Utility classes such as `space-y-*` map directly to `margin-block-*` rather than physical `margin-top`/`margin-bottom`.

---

## 9. Citation & Academic Attribution

If you utilize FoodMapper in clinical research, nutritional informatics, or software reproducibility studies, please cite this work as follows:

### BibTeX
```bibtex
@software{FoodMapper2026,
  author = {Cherrug Developer},
  title = {FoodMapper: Computational Low-FODMAP Dietetics & Microbiome Health Platform},
  version = {2.12.56},
  year = {2026},
  url = {https://github.com/cherrugdeveloper/FoodMapper},
  license = {GPL-3.0}
}
```

### APA
Cherrug Developer. (2026). *FoodMapper: Computational Low-FODMAP Dietetics & Microbiome Health Platform* (Version 2.12.56) [Computer software]. https://github.com/cherrugdeveloper/FoodMapper

---

## 10. Medical Disclaimer

FoodMapper is a nutritional calculation tool and informational resource. It does **not** constitute medical advice, diagnosis, or clinical treatment plans. Individuals suffering from gastrointestinal disorders, unexplained abdominal pain, unintended weight loss, or chronic digestive symptoms must consult a qualified gastroenterologist, physician, or registered dietitian before initiating restrictive dietary protocols.

---

## 11. License

This project is licensed under the **GNU General Public License v3.0**. See the complete [`LICENSE`](LICENSE:1) file for details.
