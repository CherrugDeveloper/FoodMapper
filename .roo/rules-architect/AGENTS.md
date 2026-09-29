# IBS Nutrition App - Architecture-Specific Rules

## Non-obvious architecture gotchas
- GitHub Pages routing: `vite.config.ts` must keep `base: './'` to avoid broken paths after deploy.
- Persistence key asymmetry: most storage uses `foodmapper_` prefix, but the disclaimer gate uses `ibs_disclaimer_accepted` with no prefix; changing either breaks existing users.
- i18n persistence: do not manually touch `localStorage.i18nextLng`; language management is handled by i18next-browser-languagedetector.
- Disclaimer must own its language selection: keep the selector inside `MedicalDisclaimer` so the user can choose language before Header/i18n-dependent UI renders.
- Data/model invariants:
  - Seasonal foods are only IDs 4, 5, 7, 8, 9, 10 via `food.months`.
  - FoodFilter bilingual search must check both translated and raw food names.
