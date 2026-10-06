import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    globals: true,
    // `pool: 'vmThreads'` is required on this project.
    //
    // Vitest 5 ships a single pre-bundled `vitest` runtime (dist/*.js). Under the
    // default 'forks' pool that runtime is externalized (it lives in node_modules
    // and matches none of Vitest's `defaultInline` patterns), so the worker
    // evaluates a SECOND, independent copy of the module. That copy's internal
    // `runner` binding is never populated by the coordinator, so the first
    // `describe()` in every test file throws
    // `TypeError: Cannot read properties of undefined (reading 'config')`.
    //
    // The 'vmThreads' pool shares the VM/module registry, so the test file and
    // the coordinator observe the same `vitest` instance and collection works.
    pool: 'vmThreads',
  },
});