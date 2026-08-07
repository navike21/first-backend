import { z } from 'zod';
import { PAYMENT_PROVIDER_KEYS } from '../constants/providerRegistry';

const paymentMethodObject = z.object({
	// References `customers` by id, same "untyped ref, no existence check"
	// convention as categoryIds/tagIds elsewhere in this codebase.
	customerId: z.uuid({ message: 'PAYMENT_METHOD_CUSTOMER_ID_INVALID' }),

	provider: z.enum(PAYMENT_PROVIDER_KEYS, {
		error: () => 'PAYMENT_METHOD_PROVIDER_INVALID',
	}),

	// The gateway-issued token for this saved card — never the raw PAN/CVV
	// (see plan / CLAUDE.md). No real tokenization flow exists yet; filled
	// via API/admin for testing until the first real provider driver lands.
	providerToken: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'PAYMENT_METHOD_PROVIDER_TOKEN_REQUIRED'
					: 'PAYMENT_METHOD_PROVIDER_TOKEN_INVALID',
		})
		.trim()
		.min(1, { message: 'PAYMENT_METHOD_PROVIDER_TOKEN_REQUIRED' })
		.max(500),

	brand: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'PAYMENT_METHOD_BRAND_REQUIRED'
					: 'PAYMENT_METHOD_BRAND_INVALID',
		})
		.trim()
		.min(1, { message: 'PAYMENT_METHOD_BRAND_REQUIRED' })
		.max(50),

	last4: z
		.string({ error: () => 'PAYMENT_METHOD_LAST4_INVALID' })
		.trim()
		.regex(/^\d{4}$/, { message: 'PAYMENT_METHOD_LAST4_INVALID' }),

	expiryMonth: z.coerce
		.number({ error: () => 'PAYMENT_METHOD_EXPIRY_MONTH_INVALID' })
		.int()
		.min(1, { message: 'PAYMENT_METHOD_EXPIRY_MONTH_INVALID' })
		.max(12, { message: 'PAYMENT_METHOD_EXPIRY_MONTH_INVALID' }),

	expiryYear: z.coerce
		.number({ error: () => 'PAYMENT_METHOD_EXPIRY_YEAR_INVALID' })
		.int()
		.min(2000, { message: 'PAYMENT_METHOD_EXPIRY_YEAR_INVALID' })
		.max(2999, { message: 'PAYMENT_METHOD_EXPIRY_YEAR_INVALID' }),

	isDefault: z.boolean().default(false),
});

export const CreatePaymentMethodSchema = paymentMethodObject;
export const UpdatePaymentMethodSchema = paymentMethodObject.partial();

export const ListPaymentMethodsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	customerId: z.uuid().optional(),
	provider: z.enum(PAYMENT_PROVIDER_KEYS).optional(),
});

export type CreatePaymentMethodInput = z.infer<typeof CreatePaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof UpdatePaymentMethodSchema>;
export type ListPaymentMethodsQuery = z.infer<typeof ListPaymentMethodsQuerySchema>;
