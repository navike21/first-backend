import { z } from 'zod';
import { DOCUMENT_TYPES_ARRAY } from '../constants/documentTypes';

export const CreateClientSchema = z.object({
	businessName: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'CLIENT_BUSINESS_NAME_REQUIRED'
					: 'CLIENT_BUSINESS_NAME_INVALID',
		})
		.min(2, { message: 'CLIENT_BUSINESS_NAME_MIN_LENGTH' })
		.max(200, { message: 'CLIENT_BUSINESS_NAME_MAX_LENGTH' })
		.trim(),

	clientType: z.enum(['person', 'company'] as const, {
		error: () => 'CLIENT_TYPE_INVALID',
	}),

	documentType: z
		.enum(DOCUMENT_TYPES_ARRAY, { error: () => 'CLIENT_DOCUMENT_TYPE_INVALID' })
		.optional(),
	documentNumber: z
		.string()
		.max(50, { message: 'CLIENT_DOCUMENT_NUMBER_MAX_LENGTH' })
		.optional(),

	country: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'CLIENT_COUNTRY_REQUIRED'
					: 'CLIENT_COUNTRY_INVALID',
		})
		.length(2, { message: 'CLIENT_COUNTRY_LENGTH' })
		.transform((v) => v.toUpperCase()),

	state: z.string().max(100).trim().optional(),
	city: z.string().max(100).trim().optional(),
	address: z.string().max(300).trim().optional(),

	logoUrl: z.url({ message: 'CLIENT_LOGO_URL_INVALID' }).optional(),
	website: z.url({ message: 'CLIENT_WEBSITE_INVALID' }).optional(),

	industry: z.string().max(100).trim().optional(),

	primaryContact: z
		.object({
			firstName: z
				.string()
				.min(2, { message: 'CLIENT_CONTACT_FIRST_NAME_MIN_LENGTH' })
				.max(100)
				.trim(),
			lastName: z
				.string()
				.min(2, { message: 'CLIENT_CONTACT_LAST_NAME_MIN_LENGTH' })
				.max(100)
				.trim(),
			email: z.email({ message: 'CLIENT_CONTACT_EMAIL_INVALID' }),
			phone: z.string().max(30).optional(),
			position: z.string().max(100).trim().optional(),
		})
		.optional(),

	notes: z
		.string()
		.max(2000, { message: 'CLIENT_NOTES_MAX_LENGTH' })
		.trim()
		.optional(),

	status: z.enum(['active', 'inactive'] as const).optional(),
});

export const UpdateClientSchema = CreateClientSchema.partial();

export const ListClientsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	status: z.string().optional(),
	search: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;
export type ListClientsQuery = z.infer<typeof ListClientsQuerySchema>;
