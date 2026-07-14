import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
	multipartWithFile,
} from '@Config/openapi/responses';
import { AppSettingsUpdateSchema } from './schemas/appSettings.schema';

const bearerAuth = [{ bearerAuth: [] }];

const appSettingsResponseSchema = registry.register(
	'AppSettings',
	z.object({
		id: z.literal('singleton'),
		general: z.object({
			appName: z.string(),
			defaultLanguage: z.string(),
			timezone: z.string(),
			maintenanceMode: z.boolean(),
		}),
		notifications: z.object({
			emailSenderName: z.string(),
			emailSenderAddress: z.email(),
			welcomeEmailEnabled: z.boolean(),
			notificationsEnabled: z.boolean(),
		}),
		appearance: z.object({
			logoUrl: z.url().nullable(),
			primaryColor: z.string().nullable(),
			faviconUrl: z.url().nullable(),
		}),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/app-settings',
	summary: 'Get the app settings',
	description:
		'Any authenticated user (settings gate individual field visibility client-side).',
	tags: ['App Settings'],
	security: bearerAuth,
	responses: {
		200: successResponse(appSettingsResponseSchema),
		401: commonErrorResponses[401],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/app-settings',
	summary: 'Update the app settings',
	description:
		'Requires `app-settings:update` or `:manage`. Multipart — optional `logo`/`favicon` file parts. Partial update — send only the sections you want to change.',
	tags: ['App Settings'],
	security: bearerAuth,
	request: {
		body: multipartWithFile(AppSettingsUpdateSchema, ['logo', 'favicon']),
	},
	responses: {
		200: successResponse(appSettingsResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});
