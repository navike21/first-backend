import { z } from 'zod';
import type { UserSchema } from '../types/user.schema';
import { USER_ROLES_ARRAY } from '@Constants/userRole';
import { STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { USER_GENDER_ARRAY } from '@Constants/userGender';

type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type UserUpdateSchema = DeepPartial<Omit<UserSchema, 'adminInformation'>> & {
	adminInformation?: DeepPartial<
		Omit<UserSchema['adminInformation'], 'password'>
	>;
};

export const UserUpdateSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: 'USER_FIRST_NAME_MIN_LENGTH' })
		.max(50, { message: 'USER_FIRST_NAME_MAX_LENGTH' })
		.optional(),

	lastName: z
		.string()
		.min(2, { message: 'USER_LAST_NAME_MIN_LENGTH' })
		.max(100, { message: 'USER_LAST_NAME_MAX_LENGTH' })
		.optional(),

	adminInformation: z
		.object({
			role: z.array(z.enum(USER_ROLES_ARRAY)).nonempty(),
		})
		.optional(),

	contactInformation: z
		.object({
			email: z.email({ message: 'USER_EMAIL_INVALID' }).optional(),

			phoneNumber: z
				.string()
				.min(9, { message: 'USER_PHONE_NUMBER_MIN_LENGTH' })
				.max(15, { message: 'USER_PHONE_NUMBER_MAX_LENGTH' })
				.optional(),

			address: z
				.string()
				.min(10, { message: 'USER_ADDRESS_MIN_LENGTH' })
				.max(300, { message: 'USER_ADDRESS_MAX_LENGTH' })
				.optional(),
		})
		.optional(),

	personalInformation: z
		.object({
			profilePictureUrl: z
				.url({ message: 'USER_PROFILE_PICTURE_VALID' })
				.optional(),
			dateOfBirth: z.date().optional(),
			gender: z.enum(USER_GENDER_ARRAY).optional(),
		})
		.optional(),

	socialMediaLinks: z
		.object({
			facebook: z.url().optional(),
			twitter: z.url().optional(),
			linkedIn: z.url().optional(),
			instagram: z.url().optional(),
			x: z.url().optional(),
			youTube: z.url().optional(),
			website: z.url().optional(),
		})
		.optional(),

	status: z.enum(STATUS_REGISTER_ARRAY).optional(),
}) satisfies z.ZodType<Partial<UserUpdateSchema>>;
