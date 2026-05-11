import AppSettingsModel from '../infrastructure/AppSettingsModel';
import { clearSettingsCache } from './getAppSettings';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import type { AppSettingsData } from '../constants/settingsDefaults';
import type { AppSettingsUpdate } from '../schemas/appSettings.schema';

function buildSetPayload(data: AppSettingsUpdate): Record<string, unknown> {
	const set: Record<string, unknown> = {};

	if (data.general) {
		for (const [key, value] of Object.entries(data.general) as [string, unknown][]) {
			if (value !== undefined) set[`general.${key}`] = value;
		}
	}
	if (data.notifications) {
		for (const [key, value] of Object.entries(data.notifications) as [string, unknown][]) {
			if (value !== undefined) set[`notifications.${key}`] = value;
		}
	}
	if (data.appearance) {
		for (const [key, value] of Object.entries(data.appearance)) {
			set[`appearance.${key}`] = value;
		}
	}

	return set;
}

export async function updateAppSettings(data: AppSettingsUpdate): Promise<AppSettingsData> {
	const set = buildSetPayload(data);

	const updated = await AppSettingsModel.findOneAndUpdate(
		{ id: 'singleton' },
		{ $set: set },
		{ new: true, upsert: true, setDefaultsOnInsert: true },
	).lean();

	clearSettingsCache();

	return cleanMongoFields(updated!) as AppSettingsData;
}
