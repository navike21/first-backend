import { z } from 'zod';

import { CLIENT_INDUSTRY_ARRAY } from '@Constants/clientIndustry';
import { CLIENT_TYPE_ARRAY } from '@Constants/clientType';
import { COUNTRY_ISO2_ARRAY } from '@Constants/countryISO2';
import { STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { TAX_IDENTIFIER_TYPE_ARRAY } from '@Constants/taxIdentifierType';

import type { ClientSchema } from '../types/client.schema';

const ClientNoteSchemaZ = z.object({
	message: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'CLIENT_NOTE_MESSAGE_REQUIRED'
					: 'CLIENT_NOTE_MESSAGE_INVALID',
		})
		.min(2, { message: 'CLIENT_NOTE_MESSAGE_MIN_LENGTH' })
		.max(500, { message: 'CLIENT_NOTE_MESSAGE_MAX_LENGTH' }),
});

const ClientContactPersonSchemaZ = z.object({
	firstName: z.string({
		error: (iss) =>
			iss.input === undefined
				? 'CLIENT_CONTACT_PERSON_FIRST_NAME_REQUIRED'
				: 'CLIENT_CONTACT_PERSON_FIRST_NAME_INVALID',
	}),
	lastName: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'CLIENT_CONTACT_PERSON_LAST_NAME_REQUIRED'
					: 'CLIENT_CONTACT_PERSON_LAST_NAME_INVALID',
		})
		.min(2, { message: 'CLIENT_CONTACT_PERSON_LAST_NAME_MIN_LENGTH' })
		.max(100, { message: 'CLIENT_CONTACT_PERSON_LAST_NAME_MAX_LENGTH' }),
	email: z.email({
		error: (iss) =>
			iss.input === undefined
				? 'CLIENT_CONTACT_PERSON_EMAIL_REQUIRED'
				: 'CLIENT_CONTACT_PERSON_EMAIL_INVALID',
	}),
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

export const ClientRegisterSchema = z.object({
	id: z.uuid({ message: 'CLIENT_ID_VALID' }).optional(),

	clientType: z.enum(CLIENT_TYPE_ARRAY, {
		error: (iss) =>
			iss.input === undefined ? 'CLIENT_TYPE_REQUIRED' : 'CLIENT_TYPE_INVALID',
	}),

	companyInformation: z.object(
		{
			businessName: z
				.string({
					error: (iss) =>
						iss.input === undefined
							? 'CLIENT_BUSINESS_NAME_REQUIRED'
							: 'CLIENT_BUSINESS_NAME_INVALID',
				})
				.min(2, { message: 'CLIENT_BUSINESS_NAME_MIN_LENGTH' })
				.max(200, { message: 'CLIENT_BUSINESS_NAME_MAX_LENGTH' }),
			industry: z.enum(CLIENT_INDUSTRY_ARRAY, {
				error: (iss) =>
					iss.input === undefined
						? 'CLIENT_INDUSTRY_REQUIRED'
						: 'CLIENT_INDUSTRY_INVALID',
			}),
			website: z.url({ message: 'CLIENT_COMPANY_WEBSITE_VALID' }).optional(),
		},
		{
			error: (iss) =>
				iss.input === undefined
					? 'CLIENT_COMPANY_INFORMATION_REQUIRED'
					: 'CLIENT_COMPANY_INFORMATION_INVALID',
		},
	),

	brandingInformation: z
		.object({
			logoUrl: z.url({
				error: (iss) =>
					iss.input === undefined
						? 'CLIENT_LOGO_URL_REQUIRED'
						: 'CLIENT_LOGO_URL_VALID',
			}),
		})
		.optional(),

	contactPersons: z
		.array(ClientContactPersonSchemaZ, {
			error: (iss) =>
				iss.input === undefined
					? 'CLIENT_CONTACT_PERSONS_REQUIRED'
					: 'CLIENT_CONTACT_PERSONS_INVALID',
		})
		.min(1, { message: 'CLIENT_CONTACT_PERSONS_MIN_1' }),

	contactInformation: z.object(
		{
			email: z.email({
				error: (iss) =>
					iss.input === undefined
						? 'CLIENT_EMAIL_REQUIRED'
						: 'CLIENT_EMAIL_INVALID',
			}),
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
		},
		{
			error: (iss) =>
				iss.input === undefined
					? 'CLIENT_CONTACT_INFORMATION_REQUIRED'
					: 'CLIENT_CONTACT_INFORMATION_INVALID',
		},
	),

	taxInformation: z
		.object({
			country: z.enum(COUNTRY_ISO2_ARRAY, {
				error: (iss) =>
					iss.input === undefined
						? 'CLIENT_TAX_COUNTRY_REQUIRED'
						: 'CLIENT_TAX_COUNTRY_INVALID',
			}),
			typeInformation: z.enum(TAX_IDENTIFIER_TYPE_ARRAY, {
				error: (iss) =>
					iss.input === undefined
						? 'CLIENT_TAX_TYPE_REQUIRED'
						: 'CLIENT_TAX_TYPE_INVALID',
			}),
			value: z
				.string({
					error: (iss) =>
						iss.input === undefined
							? 'CLIENT_TAX_VALUE_REQUIRED'
							: 'CLIENT_TAX_VALUE_INVALID',
				})
				.min(4, { message: 'CLIENT_TAX_VALUE_MIN_LENGTH' })
				.max(30, { message: 'CLIENT_TAX_VALUE_MAX_LENGTH' }),
		})
		.optional(),

	socialMediaLinks: z
		.object({
			facebook: z.url({ message: 'CLIENT_FACEBOOK_VALID' }).optional(),
			linkedIn: z.url({ message: 'CLIENT_LINKEDIN_VALID' }).optional(),
			website: z.url({ message: 'CLIENT_WEBSITE_VALID' }).optional(),
		})
		.optional(),

	status: z.enum(STATUS_REGISTER_ARRAY, {
		error: (iss) =>
			iss.input === undefined
				? 'CLIENT_STATUS_REQUIRED'
				: 'CLIENT_STATUS_INVALID',
	}),
});

export type ClientRegisterSchemaType = z.infer<typeof ClientRegisterSchema>;

export default ClientRegisterSchema satisfies z.ZodType<ClientSchema>;
