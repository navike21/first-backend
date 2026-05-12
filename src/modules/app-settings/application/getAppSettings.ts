import AppSettingsModel from '../infrastructure/AppSettingsModel';
import {
	APP_SETTINGS_DEFAULTS,
	type AppSettingsData,
} from '../constants/settingsDefaults';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

const CACHE_TTL_MS = 60_000;

let cache: { data: AppSettingsData; expiresAt: number } | null = null;

export function clearSettingsCache(): void {
	cache = null;
}

function mergeWithDefaults(doc: Partial<AppSettingsData>): AppSettingsData {
	return {
		general: { ...APP_SETTINGS_DEFAULTS.general, ...doc.general },
		notifications: {
			...APP_SETTINGS_DEFAULTS.notifications,
			...doc.notifications,
		},
		appearance: { ...APP_SETTINGS_DEFAULTS.appearance, ...doc.appearance },
	};
}

export async function getAppSettings(): Promise<AppSettingsData> {
	if (cache && Date.now() < cache.expiresAt) {
		return cache.data;
	}

	const doc = await AppSettingsModel.findOne({ id: 'singleton' }).lean();
	const data = doc
		? mergeWithDefaults(cleanMongoFields(doc) as AppSettingsData)
		: APP_SETTINGS_DEFAULTS;

	cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
	return data;
}
