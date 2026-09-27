import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'IBS Nutrition',
        short_name: 'IBS Nutrition',
        description: 'Guida nutrizionale per la gestione della sindrome dell\'intestino irritabile (IBS).',
        theme_color: '#aa3bff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'it',
        dir: 'ltr',
        icons: [
          {
            src: '/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/locales/') && url.pathname.endsWith('.json'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'i18n-translations',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      }
    })
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
