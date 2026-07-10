import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import SiteConfigModel from '../infrastructure/SiteConfigModel';
import { SITE_CONFIG_DEFAULTS, type SiteConfigData } from '../constants/siteConfigDefaults';

const CACHE_TTL_MS = 60_000;

let cache: { data: SiteConfigData; expiresAt: number } | null = null;

export function clearSiteConfigCache(): void {
	cache = null;
}

function mergeWithDefaults(doc: Partial<SiteConfigData>): SiteConfigData {
	return {
		header: {
			...SITE_CONFIG_DEFAULTS.header,
			...doc.header,
			cta: { ...SITE_CONFIG_DEFAULTS.header.cta, ...doc.header?.cta },
			mobile: { ...SITE_CONFIG_DEFAULTS.header.mobile, ...doc.header?.mobile },
		},
		footer: { ...SITE_CONFIG_DEFAULTS.footer, ...doc.footer },
		layout: { ...SITE_CONFIG_DEFAULTS.layout, ...doc.layout },
	};
}

export async function getSiteConfig(): Promise<SiteConfigData> {
	if (cache && Date.now() < cache.expiresAt) {
		return cache.data;
	}

	const doc = await SiteConfigModel.findOne({ id: 'singleton' }).lean();
	const data = doc ? mergeWithDefaults(cleanMongoFields(doc) as SiteConfigData) : SITE_CONFIG_DEFAULTS;

	cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
	return data;
}
