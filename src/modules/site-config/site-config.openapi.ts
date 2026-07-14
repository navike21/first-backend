import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
} from '@Config/openapi/responses';
import { SiteConfigUpdateSchema } from './schemas/siteConfig.schema';
import {
	HEADER_VARIANTS,
	FOOTER_VARIANTS,
	CONTENT_WIDTHS,
	SOCIAL_NETWORKS,
	MAP_PROVIDERS,
} from './constants/siteConfigDefaults';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const siteConfigResponseSchema = registry.register(
	'SiteConfig',
	z.object({
		header: z.object({
			variant: z.enum(HEADER_VARIANTS),
			sticky: z.boolean(),
			transparent: z.boolean(),
			cta: z.object({
				enabled: z.boolean(),
				labelMode: z.enum(['page', 'custom']),
				label: localizedString,
				linkType: z.enum(['page', 'url']),
				pageId: z.uuid().nullable(),
				url: z.string(),
			}),
			mobile: z.object({
				logoPosition: z.enum(['left', 'center']),
				menuIconPosition: z.enum(['left', 'right']),
			}),
		}),
		footer: z.object({
			variant: z.enum(FOOTER_VARIANTS),
			columns: z.union([z.literal(3), z.literal(4)]),
			showSocial: z.boolean(),
			showNewsletter: z.boolean(),
			copyright: localizedString,
		}),
		layout: z.object({
			contentWidth: z.enum(CONTENT_WIDTHS),
			boxedMaxWidth: z.number(),
		}),
		social: z.object(
			Object.fromEntries(SOCIAL_NETWORKS.map((n) => [n, z.string()])),
		),
		maps: z.object({ provider: z.enum(MAP_PROVIDERS) }),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/site-config/public',
	summary: 'Get the site layout config (public)',
	description:
		'Consumed by the public website project to render header/footer/layout/social/maps.',
	tags: ['Site Config'],
	responses: { 200: successResponse(siteConfigResponseSchema) },
});

registry.registerPath({
	method: 'get',
	path: '/site-config',
	summary: 'Get the site config (admin)',
	description: 'Requires `site-config:read` or `:manage`.',
	tags: ['Site Config'],
	security: bearerAuth,
	responses: {
		200: successResponse(siteConfigResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/site-config',
	summary: 'Update the site config',
	description:
		'Requires `site-config:update` or `:manage`. Partial update — send only the sections you want to change.',
	tags: ['Site Config'],
	security: bearerAuth,
	request: {
		body: {
			content: { 'application/json': { schema: SiteConfigUpdateSchema } },
		},
	},
	responses: {
		200: successResponse(siteConfigResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});
