import { Schema, model } from 'mongoose';
import type { SiteConfigData } from '../constants/siteConfigDefaults';
import {
	SITE_CONFIG_DEFAULTS,
	HEADER_VARIANTS,
	FOOTER_VARIANTS,
	CONTENT_WIDTHS,
	SOCIAL_NETWORKS,
	MAP_PROVIDERS,
} from '../constants/siteConfigDefaults';

export interface SiteConfigDocument extends SiteConfigData {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

// LocalizedString sub-shapes are stored as free-form objects (Mixed) — the Zod
// schema is the validation authority for their per-language keys.
const siteConfigSchema = new Schema<SiteConfigDocument>(
	{
		id: { type: String, required: true, unique: true, default: 'singleton' },
		header: {
			variant: {
				type: String,
				enum: HEADER_VARIANTS,
				default: SITE_CONFIG_DEFAULTS.header.variant,
			},
			sticky: { type: Boolean, default: true },
			transparent: { type: Boolean, default: false },
			cta: {
				enabled: { type: Boolean, default: false },
				labelMode: { type: String, enum: ['page', 'custom'], default: 'page' },
				label: {
					type: Schema.Types.Mixed,
					default: () => SITE_CONFIG_DEFAULTS.header.cta.label,
				},
				linkType: { type: String, enum: ['page', 'url'], default: 'page' },
				pageId: { type: String, default: null },
				url: { type: String, default: '' },
			},
			mobile: {
				logoPosition: {
					type: String,
					enum: ['left', 'center'],
					default: 'left',
				},
				menuIconPosition: {
					type: String,
					enum: ['left', 'right'],
					default: 'right',
				},
			},
		},
		footer: {
			variant: {
				type: String,
				enum: FOOTER_VARIANTS,
				default: SITE_CONFIG_DEFAULTS.footer.variant,
			},
			columns: { type: Number, enum: [3, 4], default: 4 },
			showSocial: { type: Boolean, default: true },
			showNewsletter: { type: Boolean, default: false },
			copyright: {
				type: Schema.Types.Mixed,
				default: () => SITE_CONFIG_DEFAULTS.footer.copyright,
			},
		},
		layout: {
			contentWidth: { type: String, enum: CONTENT_WIDTHS, default: 'boxed' },
			boxedMaxWidth: { type: Number, min: 640, max: 1920, default: 1200 },
		},
		social: Object.fromEntries(
			SOCIAL_NETWORKS.map((network) => [
				network,
				{ type: String, default: '' },
			]),
		),
		maps: {
			provider: {
				type: String,
				enum: MAP_PROVIDERS,
				default: SITE_CONFIG_DEFAULTS.maps.provider,
			},
		},
	},
	{ timestamps: true },
);

export default model<SiteConfigDocument>('SiteConfig', siteConfigSchema);
