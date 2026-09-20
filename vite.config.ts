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
  base: '/FoodMapper/', 
  server: {
    host: true
  }
})
