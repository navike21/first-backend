import { describe, it, expect, beforeEach, vi } from 'vitest';

async function loadWithEnv(env: Record<string, unknown>) {
	vi.resetModules();
	vi.doMock('@Constants/environments', () => ({ ENV: env }));
	const { getEmailTransport } = await import(
		'@Modules/notifications-email/infrastructure/transport/getEmailTransport'
	);
	return getEmailTransport;
}

describe('getEmailTransport', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('uses Resend when EMAIL_PROVIDER=resend', async () => {
		const get = await loadWithEnv({ EMAIL_PROVIDER: 'resend' });
		expect(get().name).toBe('resend');
	});

	it('uses SMTP when EMAIL_PROVIDER=smtp even if a Resend key exists', async () => {
		const get = await loadWithEnv({
			EMAIL_PROVIDER: 'smtp',
			RESEND_API_KEY: 're_123',
		});
		expect(get().name).toBe('smtp');
	});

	it('auto → Resend when RESEND_API_KEY is set', async () => {
		const get = await loadWithEnv({
			EMAIL_PROVIDER: 'auto',
			RESEND_API_KEY: 're_123',
		});
		expect(get().name).toBe('resend');
	});

	it('auto → SMTP when no Resend key', async () => {
		const get = await loadWithEnv({
			EMAIL_PROVIDER: 'auto',
			RESEND_API_KEY: undefined,
		});
		expect(get().name).toBe('smtp');
	});
});
