import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import EcommerceSettingsModel from '../infrastructure/EcommerceSettingsModel';
import { clearEcommerceSettingsCache } from './getEcommerceSettings';
import type { EcommerceSettingsData } from '../constants/ecommerceSettingsDefaults';
import type { EcommerceSettingsUpdate } from '../schemas/ecommerceSettings.schema';

function flatten(
	prefix: string,
	value: Record<string, unknown>,
	set: Record<string, unknown>,
): void {
	for (const [key, entry] of Object.entries(value)) {
		if (entry === undefined) continue;
		set[`${prefix}.${key}`] = entry;
	}
}

function buildSetPayload(
	data: EcommerceSettingsUpdate,
): Record<string, unknown> {
	const set: Record<string, unknown> = {};
	if (data.currency !== undefined) set.currency = data.currency;
	if (data.taxPercentage !== undefined) set.taxPercentage = data.taxPercentage;
	if (data.storeOriginAddress) {
		flatten('storeOriginAddress', data.storeOriginAddress, set);
	}
	if (data.checkoutPolicies) {
		flatten('checkoutPolicies', data.checkoutPolicies, set);
	}
	return set;
}

export async function updateEcommerceSettings(
	data: EcommerceSettingsUpdate,
): Promise<EcommerceSettingsData> {
	const set = buildSetPayload(data);

	const updated = await EcommerceSettingsModel.findOneAndUpdate(
		{ id: 'singleton' },
		{ $set: set },
		{ new: true, upsert: true, setDefaultsOnInsert: true },
	).lean();

	clearEcommerceSettingsCache();

	return cleanMongoFields(updated) as EcommerceSettingsData;
}
