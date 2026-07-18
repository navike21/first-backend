import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Modules/notifications-email/application/enqueueEmail', () => ({
	enqueueEmail: vi.fn().mockResolvedValue({ id: 'outbox-1' }),
}));
vi.mock('@Modules/notifications-email/templates/verifyEmail.template', () => ({
	verifyEmailTemplate: vi.fn(() => ({ subject: 'V', html: '<p/>' })),
}));
vi.mock('@Modules/notifications-email/templates/welcomeEmail.template', () => ({
	welcomeEmailTemplate: vi.fn(() => ({ subject: 'W', html: '<p/>' })),
}));
vi.mock(
	'@Modules/notifications-email/templates/passwordReset.template',
	() => ({
		passwordResetTemplate: vi.fn(() => ({ subject: 'R', html: '<p/>' })),
	}),
);
vi.mock('@Helpers/log', () => ({ logError: vi.fn() }));
vi.mock('@Modules/app-settings', () => ({
	getAppSettings: vi
		.fn()
		.mockResolvedValue({ general: { appName: 'Test App' } }),
	APP_SETTINGS_DEFAULTS: { general: { appName: 'My Application' } },
}));

import { registerEmailSubscribers } from '@Modules/notifications-email/application/registerEmailSubscribers';
import { enqueueEmail } from '@Modules/notifications-email/application/enqueueEmail';
import { eventBus } from '@Shared/infrastructure/EventBus';
import {
	UserRegisteredEvent,
	PasswordResetRequestedEvent,
	EmailVerifiedEvent,
} from '@Shared/events/emailEvents';

describe('registerEmailSubscribers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		registerEmailSubscribers(); // idempotent (guarded), subscribes once
	});

	it('enqueues a verification email on UserRegisteredEvent', async () => {
		await eventBus.publish(
			new UserRegisteredEvent('a@b.com', 'Al', 'http://verify', 'es'),
		);
		expect(enqueueEmail).toHaveBeenCalledWith(
			expect.objectContaining({ to: 'a@b.com' }),
		);
	});

	it('enqueues a reset email on PasswordResetRequestedEvent', async () => {
		await eventBus.publish(
			new PasswordResetRequestedEvent('c@d.com', 'Bo', 'http://reset', 'en'),
		);
		expect(enqueueEmail).toHaveBeenCalledWith(
			expect.objectContaining({ to: 'c@d.com' }),
		);
	});

	it('enqueues a welcome email on EmailVerifiedEvent', async () => {
		await eventBus.publish(new EmailVerifiedEvent('e@f.com', 'Cy', 'fr'));
		expect(enqueueEmail).toHaveBeenCalledWith(
			expect.objectContaining({ to: 'e@f.com' }),
		);
	});

	it('does not let an enqueue failure reject publish (swallowed + logged)', async () => {
		vi.mocked(enqueueEmail).mockRejectedValueOnce(new Error('mongo down'));
		await expect(
			eventBus.publish(
				new UserRegisteredEvent('g@h.com', 'Dy', 'http://v', 'en'),
			),
		).resolves.toBeUndefined();
	});
});
