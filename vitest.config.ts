import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Two test environments, chosen per file rather than globally.
 *
 * Data, validation and metadata rules run in `node` — they touch no DOM and should not
 * pay for one. Component behaviour (`tests/components/*.test.tsx`) runs in `jsdom` via
 * the per-file `@vitest-environment` docblock, which is what lets the keyboard, focus
 * and form assertions work.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    setupFiles: ['tests/setup.ts'],
  },
});
