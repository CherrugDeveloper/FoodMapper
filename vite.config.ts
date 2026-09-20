import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // Il nuovo motore di Tailwind v4 gestisce tutto qui
  ],
  server: {
    host: true // Manteniamo l'accesso Network che abbiamo configurato prima
  }
})
