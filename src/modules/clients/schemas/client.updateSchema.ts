import { z } from 'zod';

import { CLIENT_INDUSTRY_ARRAY } from '@Constants/clientIndustry';
import { CLIENT_TYPE_ARRAY } from '@Constants/clientType';
import { COUNTRY_ISO2_ARRAY } from '@Constants/countryISO2';
import { STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { TAX_IDENTIFIER_TYPE_ARRAY } from '@Constants/taxIdentifierType';

import type { ClientSchema } from '../types/client.schema';

type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends Array<infer U>
		? Array<DeepPartial<U>>
		: NonNullable<T[K]> extends object
			?
					| DeepPartial<NonNullable<T[K]>>
					| (undefined extends T[K] ? undefined : never)
			: T[K];
};

const ClientNoteSchemaZ = z.object({
	message: z
		.string()
		.min(2, { message: 'CLIENT_NOTE_MESSAGE_MIN_LENGTH' })
		.max(500, { message: 'CLIENT_NOTE_MESSAGE_MAX_LENGTH' })
		.optional(),
});

const ClientContactPersonSchemaZ = z.object({
	firstName: z.string().optional(),
	lastName: z
		.string()
		.min(2, { message: 'CLIENT_CONTACT_PERSON_LAST_NAME_MIN_LENGTH' })
		.max(100, { message: 'CLIENT_CONTACT_PERSON_LAST_NAME_MAX_LENGTH' })
		.optional(),
	email: z.email({ message: 'CLIENT_CONTACT_PERSON_EMAIL_INVALID' }).optional(),
	phoneNumber: z
		.string()
		.min(9, { message: 'CLIENT_CONTACT_PERSON_PHONE_MIN_LENGTH' })
		.max(15, { message: 'CLIENT_CONTACT_PERSON_PHONE_MAX_LENGTH' })
		.optional(),
	position: z
		.string()
		.max(120, { message: 'CLIENT_CONTACT_PERSON_POSITION_MAX' })
		.optional(),
	notes: z.array(ClientNoteSchemaZ).optional(),
});

export type ClientUpdateSchema = DeepPartial<Omit<ClientSchema, 'id'>>;

export const ClientUpdateSchema = z.object({
	clientType: z.enum(CLIENT_TYPE_ARRAY).optional(),

	companyInformation: z
		.object({
			businessName: z
				.string()
				.min(2, { message: 'CLIENT_BUSINESS_NAME_MIN_LENGTH' })
				.max(200, { message: 'CLIENT_BUSINESS_NAME_MAX_LENGTH' })
				.optional(),
			industry: z.enum(CLIENT_INDUSTRY_ARRAY).optional(),
			website: z.url({ message: 'CLIENT_COMPANY_WEBSITE_VALID' }).optional(),
		})
		.optional(),

	brandingInformation: z
		.object({
			logoUrl: z.url({ message: 'CLIENT_LOGO_URL_VALID' }).optional(),
		})
		.optional(),

	contactPersons: z.array(ClientContactPersonSchemaZ).optional(),

	contactInformation: z
		.object({
			email: z.email({ message: 'CLIENT_EMAIL_INVALID' }).optional(),
			phoneNumber: z
				.string()
				.min(9, { message: 'CLIENT_PHONE_NUMBER_MIN_LENGTH' })
				.max(15, { message: 'CLIENT_PHONE_NUMBER_MAX_LENGTH' })
				.optional(),
			address: z
				.string()
				.min(5, { message: 'CLIENT_ADDRESS_MIN_LENGTH' })
				.max(300, { message: 'CLIENT_ADDRESS_MAX_LENGTH' })
				.optional(),
		})
		.optional(),

	taxInformation: z
		.object({
			country: z.enum(COUNTRY_ISO2_ARRAY).optional(),
			typeInformation: z.enum(TAX_IDENTIFIER_TYPE_ARRAY).optional(),
			value: z
				.string()
				.min(4, { message: 'CLIENT_TAX_VALUE_MIN_LENGTH' })
				.max(30, { message: 'CLIENT_TAX_VALUE_MAX_LENGTH' })
				.optional(),
		})
		.optional(),

	socialMediaLinks: z
		.object({
			facebook: z.url().optional(),
			linkedIn: z.url().optional(),
			website: z.url().optional(),
		})
		.optional(),

	status: z.enum(STATUS_REGISTER_ARRAY).optional(),
}) satisfies z.ZodType<Partial<ClientUpdateSchema>>;
