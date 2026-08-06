import { z } from 'zod';
import { AddressSchema } from '@Shared/schemas/address.schema';

const locationObject = z.object({
	name: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'LOCATION_NAME_REQUIRED'
					: 'LOCATION_NAME_INVALID',
		})
		.min(1, { message: 'LOCATION_NAME_REQUIRED' })
		.max(150)
		.trim(),
	type: z.enum(['warehouse', 'store'], {
		error: () => 'LOCATION_TYPE_INVALID',
	}),
	address: AddressSchema.optional(),
	fulfillsOnline: z.boolean().default(true),
	isActive: z.boolean().default(true),
});

export const CreateLocationSchema = locationObject;
export const UpdateLocationSchema = locationObject.partial();

export const ListLocationsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	search: z.string().trim().max(200).optional(),
	isActive: z.coerce.boolean().optional(),
});

export type CreateLocationInput = z.infer<typeof CreateLocationSchema>;
export type UpdateLocationInput = z.infer<typeof UpdateLocationSchema>;
