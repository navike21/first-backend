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
			reporter: ['text', 'lcov'],
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
		},
	},
});
