import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    globals: true,
    // `pool: 'forks'` is recommended for Vitest 5 to avoid worker binding issues
    // Vitest 5 ships a single pre-bundled `vitest` runtime (dist/*.js). Under the
    // default 'forks' pool that runtime is externalized (it lives in node_modules
    // and matches Vitest's `defaultInline` patterns), which resolves the
    // `TypeError: Cannot read properties of undefined (reading 'config')` error.
    // The 'forks' pool shares the VM/module registry, so test files work correctly.
    pool: 'forks',
  },
});