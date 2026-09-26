import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // AGGIORNATO: Sostituisci ibs-nutrition-app con il nome esatto della tua repo su GitHub
  base: './',
  server: {
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true
    },
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - React and core libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
          // UI library chunks
          'ui-components': [
            './src/components/Header.tsx',
            './src/components/MedicalDisclaimer.tsx'
          ],
          // Feature chunks - each major feature gets its own chunk
          'feature-calculator': [
            './src/components/NutritionalCalculator.tsx'
          ],
          'feature-diet': [
            './src/components/DietPlan.tsx',
            './src/components/dietPlan/DaySummary.tsx',
            './src/components/dietPlan/MealCard.tsx',
            './src/components/dietPlan/PhaseProgress.tsx',
            './src/hooks/useDietPlan.ts'
          ],
          'feature-diary': [
            './src/components/Diary.tsx'
          ],
          'feature-recipes': [
            './src/components/Recipes.tsx',
            './src/hooks/useRecipes.ts'
          ],
          'feature-shopping': [
            './src/components/ShoppingList.tsx',
            './src/hooks/useShoppingList.ts'
          ],
          'feature-workout': [
            './src/components/WorkoutPlan.tsx',
            './src/components/ExerciseFigure.tsx'
          ],
          'feature-foods': [
            './src/components/FoodFilter.tsx'
          ],
          'feature-devices': [
            './src/components/Devices.tsx'
          ],
          'feature-education': [
            './src/components/EducationalHub.tsx'
          ],
          // Shared utilities - common code used across features
          'utils-shared': [
            './src/utils/nutritionCalculator.ts',
            './src/utils/nutritionEngine.ts',
            './src/utils/mealGenerator.ts',
            './src/utils/foodsData.ts',
            './src/utils/educationalData.ts'
          ]
        }
      }
    }
  }
})
