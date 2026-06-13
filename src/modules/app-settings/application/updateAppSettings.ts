import AppSettingsModel from '../infrastructure/AppSettingsModel';
import { clearSettingsCache } from './getAppSettings';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import type { AppSettingsData } from '../constants/settingsDefaults';
import type { AppSettingsUpdate } from '../schemas/appSettings.schema';

const APP_SETTINGS_ENTITY_TYPE = 'app-settings';

export interface AppSettingsImageFiles {
	logo?: IncomingFile;
	favicon?: IncomingFile;
}

const IMAGE_FIELDS: Array<['logo' | 'favicon', 'logoUrl' | 'faviconUrl']> = [
	['logo', 'logoUrl'],
	['favicon', 'faviconUrl'],
];

function buildSetPayload(data: AppSettingsUpdate): Record<string, unknown> {
	const set: Record<string, unknown> = {};

	if (data.general) {
		for (const [key, value] of Object.entries(data.general) as [
			string,
			unknown,
		][]) {
			if (value !== undefined) set[`general.${key}`] = value;
		}
	}
	if (data.notifications) {
		for (const [key, value] of Object.entries(data.notifications) as [
			string,
			unknown,
		][]) {
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

export async function updateAppSettings(
	data: AppSettingsUpdate,
	files: AppSettingsImageFiles = {},
	uploadedBy?: string,
): Promise<MutationResult<AppSettingsData>> {
	const warnings: ResponseWarning[] = [];
	const set = buildSetPayload(data);
	// Each image uses its own anchor (entityId = 'logo' | 'favicon') so they can
	// be replaced independently within the singleton document.
	const replacements: Array<{ entityId: string; storageId: string }> = [];

	for (const [field, settingKey] of IMAGE_FIELDS) {
		const file = files[field];
		if (!file) continue;

		const uploaded = await uploadImageSafe({
			buffer: file.buffer,
			originalName: file.originalName,
			mimeType: file.mimeType,
			entityType: APP_SETTINGS_ENTITY_TYPE,
			entityId: field,
			field,
			uploadedBy,
		});
		if (uploaded.warning) warnings.push(uploaded.warning);
		if (uploaded.url && uploaded.storageId) {
			set[`appearance.${settingKey}`] = uploaded.url;
			replacements.push({ entityId: field, storageId: uploaded.storageId });
		}
	}

	const updated = await AppSettingsModel.findOneAndUpdate(
		{ id: 'singleton' },
		{ $set: set },
		{ new: true, upsert: true, setDefaultsOnInsert: true },
	).lean();

	clearSettingsCache();

	// Remove the previous image(s), keeping the freshly uploaded one per field.
	await Promise.all(
		replacements.map((replacement) =>
			deleteEntityFiles(APP_SETTINGS_ENTITY_TYPE, replacement.entityId, {
				exceptStorageIds: [replacement.storageId],
			}).catch(() => {}),
		),
	);

	return { data: cleanMongoFields(updated) as AppSettingsData, warnings };
}
