import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import EcommerceSettingsModel from '../infrastructure/EcommerceSettingsModel';
import {
	ECOMMERCE_SETTINGS_DEFAULTS,
	type EcommerceSettingsData,
} from '../constants/ecommerceSettingsDefaults';

const CACHE_TTL_MS = 60_000;

let cache: { data: EcommerceSettingsData; expiresAt: number } | null = null;

export function clearEcommerceSettingsCache(): void {
	cache = null;
}

function mergeWithDefaults(
	doc: Partial<EcommerceSettingsData>,
): EcommerceSettingsData {
	return {
		currency: doc.currency ?? ECOMMERCE_SETTINGS_DEFAULTS.currency,
		taxPercentage:
			doc.taxPercentage ?? ECOMMERCE_SETTINGS_DEFAULTS.taxPercentage,
		storeOriginAddress: {
			...ECOMMERCE_SETTINGS_DEFAULTS.storeOriginAddress,
			...doc.storeOriginAddress,
		},
		checkoutPolicies: {
			...ECOMMERCE_SETTINGS_DEFAULTS.checkoutPolicies,
			...doc.checkoutPolicies,
		},
	};
}

export async function getEcommerceSettings(): Promise<EcommerceSettingsData> {
	if (cache && Date.now() < cache.expiresAt) {
		return cache.data;
	}

	const doc = await EcommerceSettingsModel.findOne({ id: 'singleton' }).lean();
	const data = doc
		? mergeWithDefaults(cleanMongoFields(doc) as EcommerceSettingsData)
		: ECOMMERCE_SETTINGS_DEFAULTS;

	cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
	return data;
}
