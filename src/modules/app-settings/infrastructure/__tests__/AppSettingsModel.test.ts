import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import AppSettingsModel from '../AppSettingsModel';

withMongo();

describe('AppSettingsModel', () => {
	it('creates a singleton document with defaults', async () => {
		const doc = await AppSettingsModel.create({ id: 'singleton' });

		expect(doc.id).toBe('singleton');
		expect(doc.general.appName).toBe('My Application');
		expect(doc.general.defaultLanguage).toBe('en');
		expect(doc.general.maintenanceMode).toBe(false);
		expect(doc.notifications.welcomeEmailEnabled).toBe(true);
		expect(doc.notifications.notificationsEnabled).toBe(true);
	});

	it('creates with custom general settings', async () => {
		const doc = await AppSettingsModel.create({
			id: 'singleton',
			general: {
				appName: 'My Custom App',
				defaultLanguage: 'es',
				timezone: 'America/Mexico_City',
				maintenanceMode: true,
			},
		});

		expect(doc.general.appName).toBe('My Custom App');
		expect(doc.general.defaultLanguage).toBe('es');
		expect(doc.general.maintenanceMode).toBe(true);
	});

	it('enforces unique id (singleton pattern)', async () => {
		await AppSettingsModel.create({ id: 'singleton' });
		await expect(
			AppSettingsModel.create({ id: 'singleton' }),
		).rejects.toThrow();
	});

	it('finds the singleton with findOne', async () => {
		await AppSettingsModel.create({
			id: 'singleton',
			general: { appName: 'Found App' },
		});

		const found = await AppSettingsModel.findOne({ id: 'singleton' }).lean();
		expect(found).not.toBeNull();
		expect(found!.general.appName).toBe('Found App');
	});

	it('updates the singleton with findOneAndUpdate', async () => {
		await AppSettingsModel.create({ id: 'singleton' });

		const updated = await AppSettingsModel.findOneAndUpdate(
			{ id: 'singleton' },
			{ 'general.maintenanceMode': true },
			{ new: true },
		);

		expect(updated!.general.maintenanceMode).toBe(true);
	});

	it('returns null when singleton does not exist', async () => {
		const found = await AppSettingsModel.findOne({ id: 'singleton' }).lean();
		expect(found).toBeNull();
	});
});
