import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import type { LocalizedString } from '@Shared/schemas/localizedString.schema';
import type { Address } from '@Shared/schemas/address.schema';

export interface EcommerceSettingsData {
	/** Fixed ISO 4217 code — this store bills in a single currency (see the
	 * Ecommerce plan's "Moneda" decision). */
	currency: string;
	/** Flat percentage (0-100) applied to every order, e.g. 18 for Peru's IGV. */
	taxPercentage: number;
	/** Reference address `shipping` rules calculate zone distance/cost from. */
	storeOriginAddress: Address;
	/** Placeholder terms/return-policy text, ready for a future public checkout. */
	checkoutPolicies: LocalizedString;
}

export function emptyLocalized(): LocalizedString {
	return Object.fromEntries(
		SUPPORTED_LANGUAGES.map((lang) => [lang, '']),
	) as LocalizedString;
}

function emptyAddress(): Address {
	return {
		country: '',
		ubigeoCode: '',
		region: '',
		province: '',
		district: '',
		address: '',
		addressNumber: '',
		addressInterior: '',
	};
}

export const ECOMMERCE_SETTINGS_DEFAULTS: EcommerceSettingsData = {
	currency: 'USD',
	taxPercentage: 0,
	storeOriginAddress: emptyAddress(),
	checkoutPolicies: emptyLocalized(),
};
