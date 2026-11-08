# FoodMapper · IBS Nutrition Guide & FODMAP Calculator

[![CI Test Suite](https://github.com/cherrugdeveloper/FoodMapper/actions/workflows/ci.yml/badge.svg)](https://github.com/cherrugdeveloper/FoodMapper/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)

FoodMapper is a sophisticated, progressive web application (PWA) designed for nutritional guidance, personalized biometrics calculation, trifasic diet planning, and management of Irritable Bowel Syndrome (IBS) symptoms through FODMAP tracking.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [System Requirements & Dependencies](#system-requirements--dependencies)
4. [Installation & Setup](#installation--setup)
5. [Running Tests & Computational Reproducibility](#running-tests--computational-reproducibility)
6. [Build & Deployment](#build--deployment)
7. [Project Architecture](#project-architecture)
8. [Internationalization & Persistence](#internationalization--persistence)
9. [License](#license)

---

## 🌟 Project Overview
FoodMapper provides patients and practitioners with evidence-based dietary recommendations, customized caloric and macronutrient calculators (Mifflin-St Jeor), daily diaries, specialized recipes, symptom tracking, and scientific educational resources.

---

## 🚀 Key Features
- **Trifasic Diet Planner**: Guided progression through IBS dietary phases with automated meal generation.
- **Bilingual Food Database**: Multi-language FODMAP food filter matching translated and raw names.
- **Daily Nutritional Diary**: Comprehensive macro and micronutrient tracking with water intake monitoring.
- **Sleep & Workout Trackers**: Sleep stage dashboard, advice, and structured fitness integration.
- **PWA & Offline Support**: Service worker caching and installable web application capabilities.
- **Multi-Language Support**: Italian (`it`), English (`en`), German (`de`), Spanish (`es`), and French (`fr`).

---

## ⚙️ System Requirements & Dependencies
- **Node.js**: `v18.x` or higher recommended.
- **Package Manager**: `npm` (`v9.x` or higher).
- **Browsers**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge) supporting ES modules and Service Workers.

---

## 🛠️ Installation & Setup

Clone the repository and install dependencies:

\`\`\`bash
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper
npm install
\`\`\`

---

## 🔬 Running Tests & Computational Reproducibility

To ensure computational reproducibility and verify test suite integrity across units, components, and end-to-end flows:

\`\`\`bash
# Run unit and component test suite (Vitest)
npm test

# Run tests in headless mode once
npm run test:run

# Run End-to-End tests (Playwright)
npm run test:e2e
\`\`\`

---

## 📦 Build & Deployment

To build the application for production:

\`\`\`bash
npm run build
\`\`\`

To preview the production build locally:

\`\`\`bash
npm run preview
\`\`\`

---

## 🏗️ Project Architecture

```
FoodMapper/
├── public/                # Static assets, locales, and 404 handler
│   ├── locales/           # i18n translation JSONs (it, en, de, es, fr)
│   └── 404.html           # SPA GitHub Pages redirection fallback
├── src/
│   ├── assets/            # Images and vector icons
│   ├── components/        # React UI components & views
│   ├── content/           # Markdown educational articles
│   ├── context/           # React AppContext providers
│   ├── hooks/             # Custom React hooks (search, diet, sleep, etc.)
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Calculation engines, food data, storage helpers
│   ├── App.tsx            # Root component and router configuration
│   └── main.tsx           # Entry point and PWA service worker registration
└── tests/                 # Vitest and Playwright test suites
```

---

## 🌐 Internationalization & Persistence
- **i18next**: Manages localization with dynamic JSON loading via `i18next-http-backend`.
- **Storage**: Persistent user preferences via `localStorage` (with specific handling for medical disclaimers and language state).

---

## 📄 License
Distributed under the MIT License. See [`LICENSE`](LICENSE:1) for details.
