import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFindOneAndUpdate } = vi.hoisted(() => ({
	mockFindOneAndUpdate: vi.fn(),
}));

vi.mock('../../infrastructure/AppSettingsModel', () => ({
	default: { findOneAndUpdate: mockFindOneAndUpdate },
}));

vi.mock('../getAppSettings', () => ({
	clearSettingsCache: vi.fn(),
}));

vi.mock('@Helpers/cleanMongoFields', () => ({
	cleanMongoFields: (doc: unknown) => doc,
}));

import { updateAppSettings } from '../updateAppSettings';

function mockUpdate(returnValue: object) {
	mockFindOneAndUpdate.mockReturnValue({ lean: vi.fn().mockResolvedValue(returnValue) });
}

describe('updateAppSettings', () => {
	beforeEach(() => vi.clearAllMocks());

	it('builds set payload from general fields only', async () => {
		mockUpdate({ general: { appName: 'New App' } });
		await updateAppSettings({ general: { appName: 'New App' } });

		const call = mockFindOneAndUpdate.mock.calls[0];
		expect(call[1].$set).toHaveProperty('general.appName', 'New App');
		expect(Object.keys(call[1].$set)).not.toContain('notifications.emailSenderName');
	});

	it('builds set payload from notifications fields only', async () => {
		mockUpdate({ notifications: { emailSenderName: 'Bot' } });
		await updateAppSettings({ notifications: { emailSenderName: 'Bot' } });

		const call = mockFindOneAndUpdate.mock.calls[0];
		expect(call[1].$set).toHaveProperty('notifications.emailSenderName', 'Bot');
		expect(Object.keys(call[1].$set)).not.toContain('general.appName');
	});

	it('builds set payload from appearance fields only', async () => {
		mockUpdate({ appearance: { primaryColor: '#FF0000' } });
		await updateAppSettings({ appearance: { primaryColor: '#FF0000' } });

		const call = mockFindOneAndUpdate.mock.calls[0];
		expect(call[1].$set).toHaveProperty('appearance.primaryColor', '#FF0000');
	});

	it('includes null values in appearance payload (to allow clearing)', async () => {
		mockUpdate({ appearance: { logoUrl: null } });
		await updateAppSettings({ appearance: { logoUrl: null } });

		const call = mockFindOneAndUpdate.mock.calls[0];
		expect(call[1].$set).toHaveProperty('appearance.logoUrl', null);
	});

	it('skips undefined values in general payload', async () => {
		mockUpdate({ general: { appName: 'X' } });
		await updateAppSettings({
			general: { appName: 'X', defaultLanguage: undefined },
		});

		const call = mockFindOneAndUpdate.mock.calls[0];
		expect(call[1].$set).toHaveProperty('general.appName', 'X');
		expect(Object.keys(call[1].$set)).not.toContain('general.defaultLanguage');
	});

	it('skips undefined values in notifications payload', async () => {
		mockUpdate({ notifications: { welcomeEmailEnabled: true } });
		await updateAppSettings({
			notifications: { welcomeEmailEnabled: true, notificationsEnabled: undefined },
		});

		const call = mockFindOneAndUpdate.mock.calls[0];
		expect(call[1].$set).toHaveProperty('notifications.welcomeEmailEnabled', true);
		expect(Object.keys(call[1].$set)).not.toContain('notifications.notificationsEnabled');
	});

	it('builds set payload from all three categories', async () => {
		mockUpdate({});
		await updateAppSettings({
			general: { appName: 'Full' },
			notifications: { notificationsEnabled: false },
			appearance: { primaryColor: '#AABBCC' },
		});

		const call = mockFindOneAndUpdate.mock.calls[0];
		expect(call[1].$set).toHaveProperty('general.appName', 'Full');
		expect(call[1].$set).toHaveProperty('notifications.notificationsEnabled', false);
		expect(call[1].$set).toHaveProperty('appearance.primaryColor', '#AABBCC');
	});

	it('calls findOneAndUpdate with upsert and singleton filter', async () => {
		mockUpdate({});
		await updateAppSettings({ general: { appName: 'App' } });

		const call = mockFindOneAndUpdate.mock.calls[0];
		expect(call[0]).toEqual({ id: 'singleton' });
		expect(call[2]).toMatchObject({ new: true, upsert: true, setDefaultsOnInsert: true });
	});

	it('clears the settings cache after update', async () => {
		mockUpdate({});
		const { clearSettingsCache } = await import('../getAppSettings');
		await updateAppSettings({ general: { appName: 'App' } });
		expect(clearSettingsCache).toHaveBeenCalled();
	});
});
