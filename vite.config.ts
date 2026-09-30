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
        name: 'FoodMapper - IBS Nutrition & FODMAP Calculator',
        short_name: 'FoodMapper',
        description: 'Guida nutrizionale per la gestione della sindrome dell\'intestino irritabile (IBS).',
        theme_color: '#aa3bff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: './',
        start_url: './',
        lang: 'it',
        dir: 'ltr',
        icons: [
          {
            src: './icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: './icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: './icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: './icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({request}) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache'
            }
          },
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
        manualChunks: (id) => {
          // Vendor chunks - React and core libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'vendor-markdown';
            }
            return 'vendor-other';
          }
          // Feature chunks - each major feature gets its own chunk
          if (id.includes('/src/components/NutritionalCalculator.tsx')) {
            return 'feature-calculator';
          }
          if (id.includes('/src/components/DietPlan.tsx') ||
              id.includes('/src/components/dietPlan/') ||
              id.includes('/src/hooks/useDietPlan.ts')) {
            return 'feature-diet';
          }
          if (id.includes('/src/components/Diary.tsx')) {
            return 'feature-diary';
          }
          if (id.includes('/src/components/Recipes.tsx') ||
              id.includes('/src/hooks/useRecipes.ts')) {
            return 'feature-recipes';
          }
          if (id.includes('/src/components/ShoppingList.tsx') ||
              id.includes('/src/hooks/useShoppingList.ts')) {
            return 'feature-shopping';
          }
          if (id.includes('/src/components/WorkoutPlan.tsx') ||
              id.includes('/src/components/ExerciseFigure.tsx')) {
            return 'feature-workout';
          }
          if (id.includes('/src/components/FoodFilter.tsx')) {
            return 'feature-foods';
          }
          if (id.includes('/src/components/Devices.tsx')) {
            return 'feature-devices';
          }
          if (id.includes('/src/components/EducationalHub.tsx')) {
            return 'feature-education';
          }
          if (id.includes('/src/components/Header.tsx') ||
              id.includes('/src/components/MedicalDisclaimer.tsx')) {
            return 'ui-components';
          }
          // Shared utilities
          if (id.includes('/src/utils/nutritionCalculator.ts') ||
              id.includes('/src/utils/nutritionEngine.ts') ||
              id.includes('/src/utils/mealGenerator.ts') ||
              id.includes('/src/utils/foodsData.ts') ||
              id.includes('/src/utils/educationalData.ts')) {
            return 'utils-shared';
          }
        }
      }
    }
  }
})
