# FoodMapper

FoodMapper is a specialized web application designed for IBS dietary planning and nutritional management. Built for performance and reliability, it enables users to track food intake, manage nutritional data, and support dietary requirements.

## Project Structure
- `src/`: Main source code, including React components, hooks, context, and utilities.
- `tests/`: Comprehensive unit and E2E test suites (Vitest/Playwright).
- `public/`: Assets, manifest, and static files.

## Technical Stack
- **Framework**: React 19 (TypeScript, Vite 8.3)
- **Styling**: Tailwind CSS v4
- **Internationalization**: i18next
- **Routing**: React Router v7
- **Testing**: Vitest, Playwright

## Computational Reproducibility
This project follows [Utrecht University computational reproducibility guidelines](https://utrechtuniversity.github.io/workshop-computational-reproducibility/chapters/readme-files.html), ensuring:
- Consistent dependency management (`package-lock.json`).
- Documented build and testing procedures.
- Deterministic nutritional calculations (see `src/utils/nutritionCalculator.ts`).

## Development
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Execute tests: `npm run test`
4. Linting: `npm run lint`
5. Build: `npm run build`

## License
[Insert License Information Here]
