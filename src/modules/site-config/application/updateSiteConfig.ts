import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import SiteConfigModel from '../infrastructure/SiteConfigModel';
import { clearSiteConfigCache } from './getSiteConfig';
import type { SiteConfigData } from '../constants/siteConfigDefaults';
import type { SiteConfigUpdate } from '../schemas/siteConfig.schema';

function flatten(prefix: string, value: Record<string, unknown>, set: Record<string, unknown>): void {
	for (const [key, entry] of Object.entries(value)) {
		if (entry === undefined) continue;
		const path = `${prefix}.${key}`;
		// Nested config objects (cta, mobile) flatten one level further so a
		// partial update never wipes sibling fields; localized objects are
		// stored whole.
		if (entry !== null && typeof entry === 'object' && !Array.isArray(entry) && (key === 'cta' || key === 'mobile')) {
			flatten(path, entry as Record<string, unknown>, set);
		} else {
			set[path] = entry;
		}
	}
}

function buildSetPayload(data: SiteConfigUpdate): Record<string, unknown> {
	const set: Record<string, unknown> = {};
	if (data.header) flatten('header', data.header, set);
	if (data.footer) flatten('footer', data.footer, set);
	if (data.layout) flatten('layout', data.layout, set);
	if (data.social) flatten('social', data.social, set);
	return set;
}

export async function updateSiteConfig(data: SiteConfigUpdate): Promise<SiteConfigData> {
	const set = buildSetPayload(data);

	const updated = await SiteConfigModel.findOneAndUpdate(
		{ id: 'singleton' },
		{ $set: set },
		{ new: true, upsert: true, setDefaultsOnInsert: true },
	).lean();

	clearSiteConfigCache();

	return cleanMongoFields(updated) as SiteConfigData;
}
