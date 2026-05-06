import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SySTEM_ENVIRONMENT } from '@Constants/systemEnvironment';

describe('isDevelopmentEnvironment', () => {
	const original = process.env.NODE_ENV;

	afterEach(() => {
		process.env.NODE_ENV = original;
	});

	it('returns isDevelopment true when NODE_ENV is development', async () => {
		process.env.NODE_ENV = SySTEM_ENVIRONMENT.DEVELOPMENT;
		const { isDevelopmentEnvironment } = await import('@Helpers/systemEnvironment');

		const { isDevelopment } = isDevelopmentEnvironment();

		expect(isDevelopment).toBe(true);
	});

	it('returns isDevelopment false when NODE_ENV is production', async () => {
		process.env.NODE_ENV = SySTEM_ENVIRONMENT.PRODUCTION;
		const { isDevelopmentEnvironment } = await import('@Helpers/systemEnvironment');

		const { isDevelopment } = isDevelopmentEnvironment();

		expect(isDevelopment).toBe(false);
	});
});
