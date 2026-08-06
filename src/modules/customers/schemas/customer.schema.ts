import { z } from 'zod';
import { AddressSchema } from '@Shared/schemas/address.schema';
import { DOCUMENT_TYPES_ARRAY } from '../constants/documentTypes';

const CustomerAddressSchema = AddressSchema.extend({
	type: z.enum(['shipping', 'billing'], {
		error: () => 'CUSTOMER_ADDRESS_TYPE_INVALID',
	}),
	isDefault: z.boolean().default(false),
});

const customerObject = z.object({
	firstName: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'CUSTOMER_FIRST_NAME_REQUIRED'
					: 'CUSTOMER_FIRST_NAME_INVALID',
		})
		.min(1, { message: 'CUSTOMER_FIRST_NAME_REQUIRED' })
		.max(100)
		.trim(),

	lastName: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'CUSTOMER_LAST_NAME_REQUIRED'
					: 'CUSTOMER_LAST_NAME_INVALID',
		})
		.min(1, { message: 'CUSTOMER_LAST_NAME_REQUIRED' })
		.max(100)
		.trim(),

	email: z
		.email({ message: 'CUSTOMER_EMAIL_INVALID' })
		.trim()
		.transform((v) => v.toLowerCase()),

	phone: z.string().max(30).trim().optional(),

	documentType: z
		.enum(DOCUMENT_TYPES_ARRAY, {
			error: () => 'CUSTOMER_DOCUMENT_TYPE_INVALID',
		})
		.optional(),
	documentNumber: z
		.string()
		.max(50, { message: 'CUSTOMER_DOCUMENT_NUMBER_MAX_LENGTH' })
		.optional(),

	addresses: z.array(CustomerAddressSchema).default([]),

	notes: z
		.string()
		.max(2000, { message: 'CUSTOMER_NOTES_MAX_LENGTH' })
		.trim()
		.optional(),

	status: z.enum(['active', 'inactive'] as const).optional(),
});

export const CreateCustomerSchema = customerObject;
export const UpdateCustomerSchema = customerObject.partial();

export const ListCustomersQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	status: z.string().optional(),
	search: z.string().trim().max(200).optional(),
});

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;
export type ListCustomersQuery = z.infer<typeof ListCustomersQuerySchema>;
