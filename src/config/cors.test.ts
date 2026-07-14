import { describe, it, expect, afterEach, vi } from 'vitest';

describe('corsOptions.origin', () => {
	const originalEnv = process.env.WHITELISTED_DOMAINS;

	afterEach(() => {
		process.env.WHITELISTED_DOMAINS = originalEnv;
		vi.resetModules();
	});

	it('denies any origin when WHITELISTED_DOMAINS is not configured (fail-closed)', async () => {
		process.env.WHITELISTED_DOMAINS = '';
		vi.resetModules();
		const { corsOptions } = await import('./cors');

		const callback = vi.fn();
		(corsOptions.origin as (origin: string, cb: typeof callback) => void)(
			'https://attacker.example.com',
			callback,
		);

		expect(callback).toHaveBeenCalledWith(expect.any(Error));
		expect(callback.mock.calls[0][1]).toBeUndefined();
	});

	it('allows an origin present in WHITELISTED_DOMAINS', async () => {
		process.env.WHITELISTED_DOMAINS = 'https://app.example.com';
		vi.resetModules();
		const { corsOptions } = await import('./cors');

		const callback = vi.fn();
		(corsOptions.origin as (origin: string, cb: typeof callback) => void)(
			'https://app.example.com',
			callback,
		);

		expect(callback).toHaveBeenCalledWith(null, true);
	});

	it('rejects an origin not present in WHITELISTED_DOMAINS', async () => {
		process.env.WHITELISTED_DOMAINS = 'https://app.example.com';
		vi.resetModules();
		const { corsOptions } = await import('./cors');

		const callback = vi.fn();
		(corsOptions.origin as (origin: string, cb: typeof callback) => void)(
			'https://attacker.example.com',
			callback,
		);

		expect(callback).toHaveBeenCalledWith(expect.any(Error));
	});

	it('allows requests without an origin header regardless of whitelist', async () => {
		process.env.WHITELISTED_DOMAINS = '';
		vi.resetModules();
		const { corsOptions } = await import('./cors');

		const callback = vi.fn();
		(corsOptions.origin as (origin: string | undefined, cb: typeof callback) => void)(
			undefined,
			callback,
		);

		expect(callback).toHaveBeenCalledWith(null, true);
	});
});
