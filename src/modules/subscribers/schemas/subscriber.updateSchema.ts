import { z } from 'zod';
import type { SubscriberSchema } from '../types/subscriber.schema';
import { STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { USER_GENDER_ARRAY } from '@Constants/userGender';

type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends Date
		? T[K]
		: T[K] extends object
			? DeepPartial<T[K]>
			: T[K];
};

type SubscriberUpdateSchemaType = DeepPartial<Omit<SubscriberSchema, 'id'>>;

export const SubscriberUpdateSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: 'SUBSCRIBER_FIRST_NAME_MIN_LENGTH' })
		.max(50, { message: 'SUBSCRIBER_FIRST_NAME_MAX_LENGTH' })
		.optional(),

	lastName: z
		.string()
		.min(2, { message: 'SUBSCRIBER_LAST_NAME_MIN_LENGTH' })
		.max(100, { message: 'SUBSCRIBER_LAST_NAME_MAX_LENGTH' })
		.optional(),

	contactInformation: z
		.object({
			email: z.email({ message: 'SUBSCRIBER_EMAIL_INVALID' }).optional(),

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
		})
		.optional(),

	personalInformation: z
		.object({
			profilePictureUrl: z
				.url({ message: 'SUBSCRIBER_PROFILE_PICTURE_VALID' })
				.optional(),
			dateOfBirth: z.date().optional(),
			gender: z.enum(USER_GENDER_ARRAY).optional(),
		})
		.optional(),

	status: z.enum(STATUS_REGISTER_ARRAY).optional(),
}) satisfies z.ZodType<SubscriberUpdateSchemaType>;
