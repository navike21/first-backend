import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,js}', 'tests/**/*.test.{ts,js}'],
    globals: true,
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov'],
    all: true
  }
});
