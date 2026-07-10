import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';
import { HEADER_VARIANTS, FOOTER_VARIANTS, CONTENT_WIDTHS } from '../constants/siteConfigDefaults';

const headerUpdateSchema = z
	.object({
		variant: z.enum(HEADER_VARIANTS, { error: 'SITE_CONFIG_HEADER_VARIANT_INVALID' }).optional(),
		sticky: z.boolean({ error: 'SITE_CONFIG_BOOLEAN_INVALID' }).optional(),
		transparent: z.boolean({ error: 'SITE_CONFIG_BOOLEAN_INVALID' }).optional(),
		cta: z
			.object({
				enabled: z.boolean({ error: 'SITE_CONFIG_BOOLEAN_INVALID' }).optional(),
				label: LocalizedStringSchema.optional(),
				url: z.string({ error: 'SITE_CONFIG_URL_INVALID' }).trim().max(500).optional(),
			})
			.optional(),
		mobile: z
			.object({
				logoPosition: z.enum(['left', 'center'], { error: 'SITE_CONFIG_POSITION_INVALID' }).optional(),
				menuIconPosition: z.enum(['left', 'right'], { error: 'SITE_CONFIG_POSITION_INVALID' }).optional(),
			})
			.optional(),
	})
	.optional();

const footerUpdateSchema = z
	.object({
		variant: z.enum(FOOTER_VARIANTS, { error: 'SITE_CONFIG_FOOTER_VARIANT_INVALID' }).optional(),
		columns: z
			.union([z.literal(3), z.literal(4)], { error: 'SITE_CONFIG_COLUMNS_INVALID' })
			.optional(),
		showSocial: z.boolean({ error: 'SITE_CONFIG_BOOLEAN_INVALID' }).optional(),
		showNewsletter: z.boolean({ error: 'SITE_CONFIG_BOOLEAN_INVALID' }).optional(),
		copyright: LocalizedStringSchema.optional(),
	})
	.optional();

const layoutUpdateSchema = z
	.object({
		contentWidth: z.enum(CONTENT_WIDTHS, { error: 'SITE_CONFIG_CONTENT_WIDTH_INVALID' }).optional(),
	})
	.optional();

export const SiteConfigUpdateSchema = z
	.object({
		header: headerUpdateSchema,
		footer: footerUpdateSchema,
		layout: layoutUpdateSchema,
	})
	.refine(
		(data) => data.header !== undefined || data.footer !== undefined || data.layout !== undefined,
		{ message: 'SITE_CONFIG_EMPTY_UPDATE' },
	);

export type SiteConfigUpdate = z.infer<typeof SiteConfigUpdateSchema>;
