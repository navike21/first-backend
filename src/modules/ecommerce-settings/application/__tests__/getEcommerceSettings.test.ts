import { describe, it, expect, beforeEach } from 'vitest';
import { withMongo } from '@test/withMongo';
import {
	getEcommerceSettings,
	clearEcommerceSettingsCache,
} from '../getEcommerceSettings';
import EcommerceSettingsModel from '../../infrastructure/EcommerceSettingsModel';
import { ECOMMERCE_SETTINGS_DEFAULTS } from '../../constants/ecommerceSettingsDefaults';

withMongo();

describe('getEcommerceSettings', () => {
	beforeEach(() => {
		clearEcommerceSettingsCache();
	});

	it('returns defaults when the singleton does not exist', async () => {
		const config = await getEcommerceSettings();

		expect(config).toEqual(ECOMMERCE_SETTINGS_DEFAULTS);
	});

	it('merges a partial document with defaults', async () => {
		await EcommerceSettingsModel.create({
			id: 'singleton',
			currency: 'PEN',
			taxPercentage: 18,
		});

		const config = await getEcommerceSettings();

		expect(config.currency).toBe('PEN');
		expect(config.taxPercentage).toBe(18);
		expect(config.storeOriginAddress).toEqual(
			ECOMMERCE_SETTINGS_DEFAULTS.storeOriginAddress,
		);
	});

	it('merges a partial storeOriginAddress with defaults', async () => {
		await EcommerceSettingsModel.create({
			id: 'singleton',
			storeOriginAddress: { country: 'PE', region: 'Lima' },
		});

		const config = await getEcommerceSettings();

		expect(config.storeOriginAddress.country).toBe('PE');
		expect(config.storeOriginAddress.region).toBe('Lima');
	});

	it('serves from cache within the TTL', async () => {
		await getEcommerceSettings();
		await EcommerceSettingsModel.create({
			id: 'singleton',
			currency: 'EUR',
		});

		const cached = await getEcommerceSettings();

		expect(cached.currency).toBe(ECOMMERCE_SETTINGS_DEFAULTS.currency);
	});
});
