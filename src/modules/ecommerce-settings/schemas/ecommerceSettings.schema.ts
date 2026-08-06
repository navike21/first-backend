import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';
import { AddressSchema } from '@Shared/schemas/address.schema';

export const EcommerceSettingsUpdateSchema = z
	.object({
		currency: z
			.string({ error: 'ECOMMERCE_SETTINGS_CURRENCY_INVALID' })
			.trim()
			.length(3, { message: 'ECOMMERCE_SETTINGS_CURRENCY_INVALID' })
			.transform((v) => v.toUpperCase())
			.optional(),
		taxPercentage: z
			.number({ error: 'ECOMMERCE_SETTINGS_TAX_PERCENTAGE_INVALID' })
			.min(0, { message: 'ECOMMERCE_SETTINGS_TAX_PERCENTAGE_INVALID' })
			.max(100, { message: 'ECOMMERCE_SETTINGS_TAX_PERCENTAGE_INVALID' })
			.optional(),
		storeOriginAddress: AddressSchema.optional(),
		checkoutPolicies: LocalizedStringSchema.optional(),
	})
	.refine(
		(data) =>
			data.currency !== undefined ||
			data.taxPercentage !== undefined ||
			data.storeOriginAddress !== undefined ||
			data.checkoutPolicies !== undefined,
		{ message: 'ECOMMERCE_SETTINGS_EMPTY_UPDATE' },
	);

export type EcommerceSettingsUpdate = z.infer<
	typeof EcommerceSettingsUpdateSchema
>;
