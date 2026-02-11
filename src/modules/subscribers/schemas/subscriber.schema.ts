import { z } from 'zod';
import type { SubscriberSchema } from '../types/subscriber.schema';
import { STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { USER_GENDER_ARRAY } from '@Constants/userGender';

export const SubscriberRegisterSchema = z.object({
	id: z.uuid({ message: 'SUBSCRIBER_ID_VALID' }).optional(),

	firstName: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'SUBSCRIBER_FIRST_NAME_REQUIRED'
					: 'SUBSCRIBER_FIRST_NAME_INVALID',
		})
		.min(2, { message: 'SUBSCRIBER_FIRST_NAME_MIN_LENGTH' })
		.max(50, { message: 'SUBSCRIBER_FIRST_NAME_MAX_LENGTH' }),

	lastName: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'SUBSCRIBER_LAST_NAME_REQUIRED'
					: 'SUBSCRIBER_LAST_NAME_INVALID',
		})
		.min(2, { message: 'SUBSCRIBER_LAST_NAME_MIN_LENGTH' })
		.max(100, { message: 'SUBSCRIBER_LAST_NAME_MAX_LENGTH' }),

	contactInformation: z.object(
		{
			email: z.email({
				error: (iss) =>
					iss.input === undefined
						? 'SUBSCRIBER_EMAIL_REQUIRED'
						: 'SUBSCRIBER_EMAIL_INVALID',
			}),

			phoneNumber: z
				.string()
				.min(9, { message: 'SUBSCRIBER_PHONE_NUMBER_MIN_LENGTH' })
				.max(15, { message: 'SUBSCRIBER_PHONE_NUMBER_MAX_LENGTH' })
				.optional(),

			address: z
				.string()
				.min(10, { message: 'SUBSCRIBER_ADDRESS_MIN_LENGTH' })
				.max(300, { message: 'SUBSCRIBER_ADDRESS_MAX_LENGTH' })
				.optional(),
		},
		{
			error: (iss) =>
				iss.input === undefined
					? 'SUBSCRIBER_CONTACT_INFORMATION_REQUIRED'
					: 'SUBSCRIBER_CONTACT_INFORMATION_INVALID',
		},
	),

	personalInformation: z.object(
		{
			profilePictureUrl: z
				.url({ message: 'SUBSCRIBER_PROFILE_PICTURE_VALID' })
				.optional(),
			dateOfBirth: z.date().optional(),
			gender: z.enum(USER_GENDER_ARRAY, {
				error: (iss) =>
					iss.input === undefined
						? 'SUBSCRIBER_GENDER_REQUIRED'
						: 'SUBSCRIBER_GENDER_INVALID',
			}),
		},
		{
			error: (iss) =>
				iss.input === undefined
					? 'SUBSCRIBER_PERSONAL_INFORMATION_REQUIRED'
					: 'SUBSCRIBER_PERSONAL_INFORMATION_INVALID',
		},
	),

	status: z.enum(STATUS_REGISTER_ARRAY).optional(),
}) satisfies z.ZodType<SubscriberSchema>;
