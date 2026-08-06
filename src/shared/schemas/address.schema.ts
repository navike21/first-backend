import { z } from 'zod';

// Same geo shape `clients` already uses (ubigeo code + denormalized division
// names) — centralized here so `ecommerce-settings`, `customers`, and
// `shipping` don't each redefine it. All fields optional so callers can
// compose their own required/optional wrapping (e.g. a customer address is
// required as a whole, a store origin address fills in gradually).
export const AddressSchema = z.object({
	country: z
		.string()
		.trim()
		.length(2, { message: 'ADDRESS_COUNTRY_LENGTH' })
		.transform((v) => v.toUpperCase())
		.optional(),
	ubigeoCode: z.string().max(12).trim().optional(),
	region: z.string().max(100).trim().optional(),
	province: z.string().max(100).trim().optional(),
	district: z.string().max(100).trim().optional(),
	address: z.string().max(300).trim().optional(),
	addressNumber: z.string().max(30).trim().optional(),
	addressInterior: z.string().max(60).trim().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
