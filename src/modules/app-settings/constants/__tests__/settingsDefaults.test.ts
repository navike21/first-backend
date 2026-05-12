import { describe, it, expect } from 'vitest';
import { APP_SETTINGS_DEFAULTS } from '../settingsDefaults';

describe('APP_SETTINGS_DEFAULTS', () => {
	it('has correct general defaults', () => {
		expect(APP_SETTINGS_DEFAULTS.general.appName).toBe('My Application');
		expect(APP_SETTINGS_DEFAULTS.general.defaultLanguage).toBe('en');
		expect(APP_SETTINGS_DEFAULTS.general.timezone).toBe('UTC');
		expect(APP_SETTINGS_DEFAULTS.general.maintenanceMode).toBe(false);
	});

	it('has correct notifications defaults', () => {
		expect(APP_SETTINGS_DEFAULTS.notifications.emailSenderName).toBe(
			'No Reply',
		);
		expect(APP_SETTINGS_DEFAULTS.notifications.emailSenderAddress).toBe(
			'noreply@example.com',
		);
		expect(APP_SETTINGS_DEFAULTS.notifications.welcomeEmailEnabled).toBe(true);
		expect(APP_SETTINGS_DEFAULTS.notifications.notificationsEnabled).toBe(true);
	});

	it('has an empty appearance defaults object', () => {
		expect(APP_SETTINGS_DEFAULTS.appearance).toEqual({});
	});
});
