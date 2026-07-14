import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
	test: {
		environment: 'node',
		setupFiles: ['./test.setup.ts'],
		include: ['src/**/*.test.ts'],
		globals: true,
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'lcov', 'json-summary'],
			all: true,
			// Regression floor, not a target (see README "Quality Gates") — a few
			// points below the current actuals so `pnpm test` fails on a real drop,
			// without pretending the repo is at 100% coverage today.
			thresholds: { statements: 70, branches: 65, functions: 55, lines: 70 },
			include: ['src/modules/**/*.ts'],
			// *.openapi.ts files are declarative OpenAPI registrations (no branching
			// logic to unit test) — only exercised by the live /docs endpoint, never
			// by the test suite, so they'd otherwise drag the threshold down for free.
			exclude: ['src/modules/**/__tests__/**', 'src/modules/**/*.test.ts', 'src/modules/**/*.openapi.ts'],
		},
	},
	resolve: {
		alias: {
			'@Config': resolve(__dirname, 'src/config'),
			'@Connection': resolve(__dirname, 'src/connection'),
			'@Constants': resolve(__dirname, 'src/constants'),
			'@Helpers': resolve(__dirname, 'src/helpers'),
			'@Middlewares': resolve(__dirname, 'src/middlewares'),
			'@Modules': resolve(__dirname, 'src/modules'),
			'@Shared': resolve(__dirname, 'src/shared'),
			'@Types': resolve(__dirname, 'src/types'),
			'@Routes': resolve(__dirname, 'src/routes'),
			'@test': resolve(__dirname, 'src/test'),
		},
	},
});
