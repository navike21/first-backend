import { describe, it, expect, beforeEach } from 'vitest';
import { withMongo } from '@test/withMongo';
import { getAppSettings, clearSettingsCache } from '../getAppSettings';
import AppSettingsModel from '../../infrastructure/AppSettingsModel';
import { APP_SETTINGS_DEFAULTS } from '../../constants/settingsDefaults';

withMongo();

describe('getAppSettings', () => {
	beforeEach(() => {
		clearSettingsCache();
	});

	it('returns APP_SETTINGS_DEFAULTS when no document exists in DB', async () => {
		const result = await getAppSettings();

		expect(result).toEqual(APP_SETTINGS_DEFAULTS);
	});

	it('merges stored document fields with defaults', async () => {
		await AppSettingsModel.create({
			id: 'singleton',
			general: { appName: 'Custom App', maintenanceMode: true },
		});

		const result = await getAppSettings();

		expect(result.general.appName).toBe('Custom App');
		expect(result.general.maintenanceMode).toBe(true);
		expect(result.general.defaultLanguage).toBe('en');
		expect(result.notifications.emailSenderName).toBe('No Reply');
	});

	it('merges appearance fields from stored document', async () => {
		await AppSettingsModel.create({
			id: 'singleton',
			appearance: { primaryColor: '#FF0000' },
		});

		const result = await getAppSettings();

		expect(result.appearance.primaryColor).toBe('#FF0000');
		expect(result.appearance.logoUrl).toBeNull();
	});

	it('caches the result and does not query DB again within TTL', async () => {
		await AppSettingsModel.create({ id: 'singleton' });

		await getAppSettings();

		// Change DB directly — cached call should still return old value
		await AppSettingsModel.updateOne(
			{ id: 'singleton' },
			{ 'general.appName': 'Changed After Cache' },
		);

		const cached = await getAppSettings();
		expect(cached.general.appName).toBe('My Application');
	});

	it('fetches fresh data after clearSettingsCache', async () => {
		await AppSettingsModel.create({
			id: 'singleton',
			general: { appName: 'Original' },
		});

		await getAppSettings();

		await AppSettingsModel.updateOne(
			{ id: 'singleton' },
			{ 'general.appName': 'Updated' },
		);

		clearSettingsCache();
		const fresh = await getAppSettings();

		expect(fresh.general.appName).toBe('Updated');
	});

	it('returns full notifications block merged with defaults', async () => {
		await AppSettingsModel.create({
			id: 'singleton',
			notifications: { notificationsEnabled: false },
		});

		const result = await getAppSettings();

		expect(result.notifications.notificationsEnabled).toBe(false);
		expect(result.notifications.welcomeEmailEnabled).toBe(true);
		expect(result.notifications.emailSenderAddress).toBe('noreply@example.com');
	});
});
