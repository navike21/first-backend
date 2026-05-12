import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFindOne } = vi.hoisted(() => ({ mockFindOne: vi.fn() }));

vi.mock('../../infrastructure/AppSettingsModel', () => ({
	default: { findOne: mockFindOne },
}));

vi.mock('@Helpers/cleanMongoFields', () => ({
	cleanMongoFields: (doc: unknown) => doc,
}));

import { getAppSettings, clearSettingsCache } from '../getAppSettings';
import { APP_SETTINGS_DEFAULTS } from '../../constants/settingsDefaults';

function chainedFindOne(value: unknown) {
	mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(value) });
}

describe('getAppSettings', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		clearSettingsCache();
	});

	it('returns APP_SETTINGS_DEFAULTS when no document exists', async () => {
		chainedFindOne(null);
		const result = await getAppSettings();
		expect(result).toEqual(APP_SETTINGS_DEFAULTS);
	});

	it('merges document fields with defaults when doc exists', async () => {
		chainedFindOne({
			general: { appName: 'Custom App' },
			notifications: {},
			appearance: {},
		});
		const result = await getAppSettings();
		expect(result.general.appName).toBe('Custom App');
		expect(result.general.defaultLanguage).toBe('en');
		expect(result.notifications.emailSenderName).toBe('No Reply');
	});

	it('caches the result and does not call findOne again within TTL', async () => {
		chainedFindOne(null);

		await getAppSettings();
		await getAppSettings();

		expect(mockFindOne).toHaveBeenCalledTimes(1);
	});

	it('calls findOne again after clearSettingsCache', async () => {
		chainedFindOne(null);

		await getAppSettings();
		clearSettingsCache();
		await getAppSettings();

		expect(mockFindOne).toHaveBeenCalledTimes(2);
	});

	it('fetches fresh data after TTL expires', async () => {
		vi.useFakeTimers();
		chainedFindOne(null);

		await getAppSettings();
		vi.advanceTimersByTime(61_000);
		await getAppSettings();

		expect(mockFindOne).toHaveBeenCalledTimes(2);
		vi.useRealTimers();
	});

	it('merges appearance fields from doc', async () => {
		chainedFindOne({
			general: {},
			notifications: {},
			appearance: { primaryColor: '#FF0000' },
		});
		const result = await getAppSettings();
		expect(result.appearance.primaryColor).toBe('#FF0000');
	});
});
