import { Schema, model } from 'mongoose';
import { addressType } from '@Shared/infrastructure/addressType';
import type { EcommerceSettingsData } from '../constants/ecommerceSettingsDefaults';
import { ECOMMERCE_SETTINGS_DEFAULTS } from '../constants/ecommerceSettingsDefaults';

export interface EcommerceSettingsDocument extends EcommerceSettingsData {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

// `checkoutPolicies` (LocalizedString) is stored as free-form Mixed — the Zod
// schema is the validation authority for its per-language keys, same
// convention as `SiteConfigModel`'s `label`/`copyright` fields.
const ecommerceSettingsSchema = new Schema<EcommerceSettingsDocument>(
	{
		id: { type: String, required: true, unique: true, default: 'singleton' },
		currency: {
			type: String,
			required: true,
			maxLength: 3,
			uppercase: true,
			default: ECOMMERCE_SETTINGS_DEFAULTS.currency,
		},
		taxPercentage: {
			type: Number,
			required: true,
			min: 0,
			max: 100,
			default: ECOMMERCE_SETTINGS_DEFAULTS.taxPercentage,
		},
		storeOriginAddress: { type: addressType, default: () => ({}) },
		checkoutPolicies: {
			type: Schema.Types.Mixed,
			default: () => ECOMMERCE_SETTINGS_DEFAULTS.checkoutPolicies,
		},
	},
	{ timestamps: true },
);

export default model<EcommerceSettingsDocument>(
	'EcommerceSettings',
	ecommerceSettingsSchema,
);
