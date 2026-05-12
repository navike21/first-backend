import { z } from 'zod';

const generalUpdateSchema = z
	.object({
		appName: z
			.string({ error: 'APP_SETTINGS_APP_NAME_INVALID' })
			.min(1)
			.max(100)
			.optional(),
		defaultLanguage: z
			.string({ error: 'APP_SETTINGS_LANG_INVALID' })
			.min(2)
			.max(10)
			.optional(),
		timezone: z.string({ error: 'APP_SETTINGS_TIMEZONE_INVALID' }).optional(),
		maintenanceMode: z
			.boolean({ error: 'APP_SETTINGS_MAINTENANCE_INVALID' })
			.optional(),
	})
	.optional();

const notificationsUpdateSchema = z
	.object({
		emailSenderName: z
			.string({ error: 'APP_SETTINGS_SENDER_NAME_INVALID' })
			.min(1)
			.max(100)
			.optional(),
		emailSenderAddress: z
			.email({ message: 'APP_SETTINGS_EMAIL_INVALID' })
			.optional(),
		welcomeEmailEnabled: z
			.boolean({ error: 'APP_SETTINGS_WELCOME_EMAIL_INVALID' })
			.optional(),
		notificationsEnabled: z
			.boolean({ error: 'APP_SETTINGS_NOTIFICATIONS_INVALID' })
			.optional(),
	})
	.optional();

const appearanceUpdateSchema = z
	.object({
		logoUrl: z.url({ message: 'APP_SETTINGS_URL_INVALID' }).nullish(),
		primaryColor: z
			.string({ error: 'APP_SETTINGS_COLOR_INVALID' })
			.regex(/^#[0-9a-fA-F]{6}$/, { message: 'APP_SETTINGS_COLOR_INVALID' })
			.nullish(),
		faviconUrl: z.url({ message: 'APP_SETTINGS_URL_INVALID' }).nullish(),
	})
	.optional();

export const AppSettingsUpdateSchema = z
	.object({
		general: generalUpdateSchema,
		notifications: notificationsUpdateSchema,
		appearance: appearanceUpdateSchema,
	})
	.refine(
		(data) =>
			data.general !== undefined ||
			data.notifications !== undefined ||
			data.appearance !== undefined,
		{ message: 'APP_SETTINGS_EMPTY_UPDATE' },
	);

export type AppSettingsUpdate = z.infer<typeof AppSettingsUpdateSchema>;
