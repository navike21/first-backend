import { z } from 'zod';
import type { UserSchema } from '../types/user.schema';
import { USER_ROLES_ARRAY } from '@Constants/userRole';
import { STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';

export const UserRegisterSchema = z.object({
	id: z.uuid({ message: 'USER_ID_VALID' }).optional(),

	firstName: z.string({
		error: (iss) =>
			iss.input === undefined
				? 'USER_FIRST_NAME_REQUIRED'
				: 'USER_FIRST_NAME_INVALID',
	}),

	lastName: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'USER_LAST_NAME_REQUIRED'
					: 'USER_LAST_NAME_INVALID',
		})
		.min(2, { message: 'USER_LAST_NAME_MIN_LENGTH' })
		.max(100, { message: 'USER_LAST_NAME_MAX_LENGTH' }),

	adminInformation: z.object(
		{
			password: z
				.string({
					error: (iss) =>
						iss.input === undefined
							? 'USER_PASSWORD_REQUIRED'
							: 'USER_PASSWORD_INVALID',
				})
				.min(8, { message: 'USER_PASSWORD_MIN_LENGTH' }),

			role: z
				.array(z.enum(USER_ROLES_ARRAY))
				.nonempty({ message: 'USER_ROLE_REQUIRED' }),
		},
		{
			error: (iss) =>
				iss.input === undefined
					? 'USER_ADMIN_INFORMATION_REQUIRED'
					: 'USER_ADMIN_INFORMATION_INVALID',
		},
	),

	contactInformation: z.object(
		{
			email: z.email({
				error: (iss) =>
					iss.input === undefined
						? 'USER_EMAIL_REQUIRED'
						: 'USER_EMAIL_INVALID',
			}),

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
		},
		{
			error: (iss) =>
				iss.input === undefined
					? 'USER_CONTACT_INFORMATION_REQUIRED'
					: 'USER_CONTACT_INFORMATION_INVALID',
		},
	),

	personalInformation: z.object(
		{
			profilePictureUrl: z
				.url({ message: 'USER_PROFILE_PICTURE_VALID' })
				.optional(),
			dateOfBirth: z.date().optional(),
			gender: z.enum(['male', 'female'], {
				error: (iss) =>
					iss.input === undefined
						? 'USER_GENDER_REQUIRED'
						: 'USER_GENDER_INVALID',
			}),
		},
		{
			error: (iss) =>
				iss.input === undefined
					? 'USER_PERSONAL_INFORMATION_REQUIRED'
					: 'USER_PERSONAL_INFORMATION_INVALID',
		},
	),

	socialMediaLinks: z
		.object({
			facebook: z.url({ message: 'USER_FACEBOOK_VALID' }).optional(),
			twitter: z.url({ message: 'USER_TWITTER_VALID' }).optional(),
			linkedIn: z.url({ message: 'USER_LINKEDIN_VALID' }).optional(),
			instagram: z.url({ message: 'USER_INSTAGRAM_VALID' }).optional(),
			x: z.url({ message: 'USER_X_VALID' }).optional(),
			youTube: z.url({ message: 'USER_YOUTUBE_VALID' }).optional(),
			website: z.url({ message: 'USER_WEBSITE_VALID' }).optional(),
		})
		.optional(),

	status: z.enum(STATUS_REGISTER_ARRAY, {
		error: (iss) =>
			iss.input === undefined ? 'USER_STATUS_REQUIRED' : 'USER_STATUS_INVALID',
	}),
}) satisfies z.ZodType<UserSchema>;
