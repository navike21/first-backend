import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Modules/notifications-email/application/sendEmail', () => ({
	sendEmail: vi.fn().mockResolvedValue(undefined),
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
import { sendEmail } from '@Modules/notifications-email/application/sendEmail';
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

	// Sending is async (the brand is fetched from app-settings first), so wait.
	it('sends a verification email on UserRegisteredEvent', async () => {
		await eventBus.publish(
			new UserRegisteredEvent('a@b.com', 'Al', 'http://verify', 'es'),
		);
		await vi.waitFor(() =>
			expect(sendEmail).toHaveBeenCalledWith(
				expect.objectContaining({ to: 'a@b.com' }),
			),
		);
	});

	it('sends a reset email on PasswordResetRequestedEvent', async () => {
		await eventBus.publish(
			new PasswordResetRequestedEvent('c@d.com', 'Bo', 'http://reset', 'en'),
		);
		await vi.waitFor(() =>
			expect(sendEmail).toHaveBeenCalledWith(
				expect.objectContaining({ to: 'c@d.com' }),
			),
		);
	});

	it('sends a welcome email on EmailVerifiedEvent', async () => {
		await eventBus.publish(new EmailVerifiedEvent('e@f.com', 'Cy', 'fr'));
		await vi.waitFor(() =>
			expect(sendEmail).toHaveBeenCalledWith(
				expect.objectContaining({ to: 'e@f.com' }),
			),
		);
	});

	it('does not let an email failure reject publish (fire-and-forget)', async () => {
		vi.mocked(sendEmail).mockRejectedValueOnce(new Error('smtp down'));
		await expect(
			eventBus.publish(
				new UserRegisteredEvent('g@h.com', 'Dy', 'http://v', 'en'),
			),
		).resolves.toBeUndefined();
	});
});
