import { describe, it, expect, beforeEach } from 'vitest';
import { withMongo } from '@test/withMongo';
import { getSiteConfig, clearSiteConfigCache } from '../getSiteConfig';
import SiteConfigModel from '../../infrastructure/SiteConfigModel';
import { SITE_CONFIG_DEFAULTS } from '../../constants/siteConfigDefaults';

withMongo();

describe('getSiteConfig', () => {
	beforeEach(() => {
		clearSiteConfigCache();
	});

	it('returns defaults when the singleton does not exist', async () => {
		const config = await getSiteConfig();

		expect(config).toEqual(SITE_CONFIG_DEFAULTS);
	});

	it('merges a partial document with defaults (nested cta/mobile included)', async () => {
		await SiteConfigModel.create({
			id: 'singleton',
			header: { variant: 'logo-center-split' },
			footer: { variant: 'minimal' },
		});

		const config = await getSiteConfig();

		expect(config.header.variant).toBe('logo-center-split');
		expect(config.header.sticky).toBe(true);
		expect(config.header.cta.enabled).toBe(false);
		expect(config.header.mobile.logoPosition).toBe('left');
		expect(config.footer.variant).toBe('minimal');
		expect(config.footer.columns).toBe(4);
		expect(config.layout.contentWidth).toBe('boxed');
	});

	it('merges a partial maps document with defaults', async () => {
		await SiteConfigModel.create({
			id: 'singleton',
			maps: { provider: 'osm' },
		});

		const config = await getSiteConfig();

		expect(config.maps.provider).toBe('osm');
	});

	it('serves from cache within the TTL', async () => {
		await getSiteConfig();
		await SiteConfigModel.create({
			id: 'singleton',
			footer: { variant: 'centered' },
		});

		const cached = await getSiteConfig();

		expect(cached.footer.variant).toBe(SITE_CONFIG_DEFAULTS.footer.variant);
	});
});
