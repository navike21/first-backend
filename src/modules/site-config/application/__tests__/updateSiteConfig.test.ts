import { describe, it, expect, beforeEach } from 'vitest';
import { withMongo } from '@test/withMongo';
import { updateSiteConfig } from '../updateSiteConfig';
import { getSiteConfig, clearSiteConfigCache } from '../getSiteConfig';
import SiteConfigModel from '../../infrastructure/SiteConfigModel';

withMongo();

describe('updateSiteConfig', () => {
	beforeEach(() => {
		clearSiteConfigCache();
	});

	it('creates the singleton via upsert when it does not exist', async () => {
		const data = await updateSiteConfig({ header: { variant: 'logo-center-stacked' } });

		expect(data.header.variant).toBe('logo-center-stacked');
		const doc = await SiteConfigModel.findOne({ id: 'singleton' });
		expect(doc).not.toBeNull();
	});

	it('updates one category without touching the others', async () => {
		await SiteConfigModel.create({
			id: 'singleton',
			footer: { variant: 'cta-columns', columns: 3 },
		});

		await updateSiteConfig({ header: { sticky: false } });

		const doc = await SiteConfigModel.findOne({ id: 'singleton' }).lean();
		expect(doc!.header.sticky).toBe(false);
		expect(doc!.footer.variant).toBe('cta-columns');
		expect(doc!.footer.columns).toBe(3);
	});

	it('flattens nested cta/mobile updates so sibling fields survive', async () => {
		await updateSiteConfig({
			header: { cta: { enabled: true, url: '/contact' }, mobile: { logoPosition: 'center' } },
		});

		await updateSiteConfig({ header: { cta: { url: '/pricing' } } });

		const doc = await SiteConfigModel.findOne({ id: 'singleton' }).lean();
		expect(doc!.header.cta.enabled).toBe(true);
		expect(doc!.header.cta.url).toBe('/pricing');
		expect(doc!.header.mobile.logoPosition).toBe('center');
	});

	it('clears the read cache after updating', async () => {
		await getSiteConfig();

		await updateSiteConfig({ layout: { contentWidth: 'full' } });

		const fresh = await getSiteConfig();
		expect(fresh.layout.contentWidth).toBe('full');
	});
});
