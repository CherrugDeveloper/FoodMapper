# FoodMapper

A comprehensive dietary planning and nutrition tracking application.

## Key Features

- **Personalized Diet Planning**: Generate multi-day meal plans based on nutritional requirements and dietary restrictions
- **Meal Customization**: Modify and complete daily meal plans with visual progress tracking
- **Nutritional Calculator**: Calculate daily nutritional requirements based on personal data
- **Food Database**: Searchable database with multilingual support
- **Diary Tracking**: Log meals and track nutritional intake
- **Recipe Management**: Store and discover recipes

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/             # React context and types
├── hooks/               # Custom React hooks
├── utils/               # Utility functions and helpers
├── i18n.ts              # Internationalization configuration
└── main.tsx             # Application entry point
```

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## Installation

```bash
npm install
```

## Run development server

```bash
npm run dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |
| `npm run test:run` | Run tests in CI mode |
| `npm run test:e2e` | Run end-to-end tests |

## License

[MIT](LICENSE)