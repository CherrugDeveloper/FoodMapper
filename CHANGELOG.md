## [2.12.134] - 2026-11-23

### Fixed
- **PhaseProgress**: Fixed pre-start badge to show only day number (removed redundant "giorni dall'inizio fase 0" text)
- **PhaseProgress**: Added phase 3 personalization days display showing "Giorni personalizzazione X" instead of "/∞"
- **mealGenerator**: Updated unit mappings:
  - Tempeh (id '57'): changed from unitGrams 150 to 100 (panetti)
  - Banana (id '29'): changed from unitGrams 100 to 120 (conteggi)
  - Pomodori (id '22'): added with unitGrams 150 (conteggi)
  - Patate (id '24'): added with unitGrams 180 (conteggi)
- **mealGenerator**: Fixed undefined variable `maxFatFromCalories` - replaced with inline calculation `mealKcal * 0.35 / 9`
- **i18n**: Added `diet_phase_personalization_days` translation key in all 5 languages (it, en, es, fr, de)
- **mealGenerator**: Added Lamponi (id '53') and Arance (id '15') to whole units support

## [2.12.133] - 2026-11-22

### Fixed
- **CI/CD**: Fixed invalid GitHub Actions versions (`@v6` → `@v4`/`@v5`) and added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` env var for Node.js 24 compatibility in CI pipeline
- **PhaseProgress**: Fixed duplicate "Pre-inizio" text when selecting days before phase 0
- **FoodsData**: Fixed egg naming from "Uova (2 medie ~100g)" to "Uova"
- **FoodsData**: Fixed Avena naming from "Avena in fiocchi (da cuocere per porridge)" to "Avena in fiocchi"
- **FoodsData**: Split merged "Arance e Mandarino" into separate Arance and Mandarino entries
- **MealGenerator**: Added banana quantization to whole units (~100g each)

- **CI/CD**: Fixed invalid GitHub Actions versions (`@v6` → `@v4`/`@v5`) and added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` env var for Node.js 24 compatibility in CI pipeline
- **PhaseProgress**: Fixed duplicate "Pre-inizio" text when selecting days before phase 0
- **FoodsData**: Fixed egg naming from "Uova (2 medie ~100g)" to "Uova"
- **FoodsData**: Fixed Avena naming from "Avena in fiocchi (da cuocere per porridge)" to "Avena in fiocchi"
- **FoodsData**: Split merged "Arance e Mandarino" into separate Arance and Mandarino entries
- **MealGenerator**: Added banana quantization to whole units (~100g each)

## [2.12.131] - 2026-11-22

### Fixed
- **Meal Generator**: Fixed protein normalization to properly scale calories when protein target is exceeded - uses results.proteins target instead of hardcoded 100g, and scales carbs/fats proportionally to remaining calories

### Changed
- **Meal Generator**: Updated normalization logic to use results.proteins target and proportional macro scaling instead of uniform proteinScale
