import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import type { LocalizedString } from '@Shared/schemas/localizedString.schema';

export const HEADER_VARIANTS = [
	'logo-left-menu-right',
	'logo-left-menu-center',
	'logo-center-split',
	'logo-center-stacked',
] as const;
export type HeaderVariant = (typeof HEADER_VARIANTS)[number];

export const FOOTER_VARIANTS = ['columns', 'centered', 'minimal', 'cta-columns'] as const;
export type FooterVariant = (typeof FOOTER_VARIANTS)[number];

export const CONTENT_WIDTHS = ['boxed', 'full'] as const;
export type ContentWidth = (typeof CONTENT_WIDTHS)[number];

export interface HeaderConfig {
	variant: HeaderVariant;
	sticky: boolean;
	transparent: boolean;
	cta: {
		enabled: boolean;
		label: LocalizedString;
		/** 'page' links to a CMS page by id; 'url' uses the free-form url field. */
		linkType: 'page' | 'url';
		pageId: string | null;
		url: string;
	};
	mobile: {
		logoPosition: 'left' | 'center';
		menuIconPosition: 'left' | 'right';
	};
}

export interface FooterConfig {
	variant: FooterVariant;
	columns: 3 | 4;
	showSocial: boolean;
	showNewsletter: boolean;
	copyright: LocalizedString;
}

export interface LayoutConfig {
	contentWidth: ContentWidth;
	/** Max content width in px, only meaningful when contentWidth === 'boxed'. */
	boxedMaxWidth: number;
}

export interface SiteConfigData {
	header: HeaderConfig;
	footer: FooterConfig;
	layout: LayoutConfig;
}

export function emptyLocalized(): LocalizedString {
	return Object.fromEntries(SUPPORTED_LANGUAGES.map((lang) => [lang, ''])) as LocalizedString;
}

export const SITE_CONFIG_DEFAULTS: SiteConfigData = {
	header: {
		variant: 'logo-left-menu-right',
		sticky: true,
		transparent: false,
		cta: { enabled: false, label: emptyLocalized(), linkType: 'page', pageId: null, url: '' },
		mobile: { logoPosition: 'left', menuIconPosition: 'right' },
	},
	footer: {
		variant: 'columns',
		columns: 4,
		showSocial: true,
		showNewsletter: false,
		copyright: emptyLocalized(),
	},
	layout: { contentWidth: 'boxed', boxedMaxWidth: 1200 },
};
