import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,js}', 'tests/**/*.test.{ts,js}'],
    globals: true,
  },
  resolve: {
    alias: {
      '@Constants/environments': resolve(__dirname, 'src/constants/environments.ts'),
      '@Constants/systemEnvironment': resolve(__dirname, 'src/constants/systemEnvironment.ts'),
      '@Config/i18n': resolve(__dirname, 'src/config/i18n.ts'),
      '@Helpers': resolve(__dirname, 'src/helpers'),
      '@Modules': resolve(__dirname, 'src/modules'),
      '@Routes': resolve(__dirname, 'src/routes'),
      '@Config': resolve(__dirname, 'src/config'),
      '@Types/responseStructure': resolve(__dirname, 'src/types/responseStructure.ts')
    }
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov'],
    all: true
  }
});
