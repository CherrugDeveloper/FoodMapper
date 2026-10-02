# IBS Nutrition App

A comprehensive nutrition tracking and meal planning application designed to help users manage their dietary needs, track nutritional intake, and optimize their health.

## Features

- **Nutritional Tracking**: Log and analyze food intake with detailed nutritional breakdowns.
- **Meal Planning**: Generate personalized meal plans based on dietary requirements.
- **Bilingual Support**: Search and filter foods in multiple languages.
- **Notification Reminders**: Set up reminders for medication, water intake, and other health-related tasks.
- **Disclaimer Management**: Language-specific disclaimers with type validation and expiration.
- **Architecture Improvements**: Memoization for nutritional calculations, optimized data flow, and secure storage utilities.

## Installation

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ibs-nutrition-app.git
   cd ibs-nutrition-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (if needed):
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

### Running the Application
- Start the development server:
  ```bash
  npm run dev
  ```

- Build for production:
  ```bash
  npm run build
  ```

- Run tests:
  ```bash
  npm test
  ```

### Key Components

- **Hooks**:
  - `useFoodSearch`: Encapsulates bilingual food search functionality.
  - `useNotificationPermission`: Manages comprehensive notification permissions.
  - `useDisclaimerGate`: Isolates language context for disclaimers.

- **Utilities**:
  - `storage.ts`: Secure storage with type validation and expiration.
  - `nutritionCalculator.ts`: Memoized nutritional calculation pipeline.

## Architecture Improvements

### New Patterns Implemented
- **Memoization**: Added to the nutritional calculation pipeline to optimize performance.
- **Bilingual Matching**: Implemented in `FoodFilter` for accurate food search across languages.
- **Notification Permissions**: Comprehensive handling of `Notification.requestPermission()` states.
- **Disclaimer Storage**: Updated with type validation and expiration checks.

### Key Files

- **`src/hooks/useFoodSearch.ts`**: Bilingual food search hook.
- **`src/hooks/useNotificationPermission.ts`**: Notification permission management.
- **`src/utils/storage.ts`**: Disclaimer and other storage utilities.
- **`src/utils/nutritionCalculator.ts`**: Memoized nutritional calculations.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

### Code Style

- Follow the existing TypeScript and ESLint configurations.
- Ensure all hooks adhere to the **Hook-First Guard** pattern.
- Use consistent naming conventions and type safety.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
