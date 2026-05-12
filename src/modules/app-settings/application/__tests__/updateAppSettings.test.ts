import { describe, it, expect, beforeEach } from 'vitest';
import { withMongo } from '@test/withMongo';
import { updateAppSettings } from '../updateAppSettings';
import { getAppSettings, clearSettingsCache } from '../getAppSettings';
import AppSettingsModel from '../../infrastructure/AppSettingsModel';

withMongo();

describe('updateAppSettings', () => {
	beforeEach(() => {
		clearSettingsCache();
	});

	it('creates the singleton via upsert when it does not exist', async () => {
		const result = await updateAppSettings({
			general: { appName: 'Upserted App' },
		});

		expect(result.general.appName).toBe('Upserted App');
		const doc = await AppSettingsModel.findOne({ id: 'singleton' });
		expect(doc).not.toBeNull();
	});

	it('updates general fields and leaves others untouched', async () => {
		await AppSettingsModel.create({
			id: 'singleton',
			notifications: { notificationsEnabled: false },
		});

		await updateAppSettings({ general: { appName: 'Updated App' } });

		const doc = await AppSettingsModel.findOne({ id: 'singleton' }).lean();
		expect(doc!.general.appName).toBe('Updated App');
		expect(doc!.notifications.notificationsEnabled).toBe(false);
	});

	it('skips undefined values — does not overwrite existing DB values', async () => {
		await AppSettingsModel.create({
			id: 'singleton',
			general: { appName: 'Original', defaultLanguage: 'es' },
		});

		await updateAppSettings({
			general: { appName: 'New Name', defaultLanguage: undefined },
		});

		const doc = await AppSettingsModel.findOne({ id: 'singleton' }).lean();
		expect(doc!.general.appName).toBe('New Name');
		expect(doc!.general.defaultLanguage).toBe('es');
	});

	it('updates notifications fields', async () => {
		await updateAppSettings({
			notifications: { emailSenderName: 'My Bot', notificationsEnabled: false },
		});

		const doc = await AppSettingsModel.findOne({ id: 'singleton' }).lean();
		expect(doc!.notifications.emailSenderName).toBe('My Bot');
		expect(doc!.notifications.notificationsEnabled).toBe(false);
	});

	it('sets appearance.primaryColor to null (allows clearing)', async () => {
		await AppSettingsModel.create({
			id: 'singleton',
			appearance: { primaryColor: '#FF0000' },
		});

		await updateAppSettings({ appearance: { primaryColor: null } });

		const doc = await AppSettingsModel.findOne({ id: 'singleton' }).lean();
		expect(doc!.appearance.primaryColor).toBeNull();
	});

	it('updates all three categories in one call', async () => {
		await updateAppSettings({
			general: { appName: 'Full Update' },
			notifications: { notificationsEnabled: false },
			appearance: { primaryColor: '#AABBCC' },
		});

		const doc = await AppSettingsModel.findOne({ id: 'singleton' }).lean();
		expect(doc!.general.appName).toBe('Full Update');
		expect(doc!.notifications.notificationsEnabled).toBe(false);
		expect(doc!.appearance.primaryColor).toBe('#AABBCC');
	});

	it('invalidates the cache after update', async () => {
		await AppSettingsModel.create({
			id: 'singleton',
			general: { appName: 'Cached' },
		});

		const before = await getAppSettings();
		expect(before.general.appName).toBe('Cached');

		await updateAppSettings({ general: { appName: 'After Update' } });

		// Cache was cleared by updateAppSettings, so next call fetches fresh
		const after = await getAppSettings();
		expect(after.general.appName).toBe('After Update');
	});

	it('returns updated settings without _id and __v', async () => {
		const result = await updateAppSettings({
			general: { appName: 'Clean Fields' },
		});

		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('__v');
		expect(result.general.appName).toBe('Clean Fields');
	});
});
