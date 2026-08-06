import { describe, it, expect, beforeEach } from 'vitest';
import { withMongo } from '@test/withMongo';
import { updateEcommerceSettings } from '../updateEcommerceSettings';
import {
	getEcommerceSettings,
	clearEcommerceSettingsCache,
} from '../getEcommerceSettings';
import EcommerceSettingsModel from '../../infrastructure/EcommerceSettingsModel';

withMongo();

describe('updateEcommerceSettings', () => {
	beforeEach(() => {
		clearEcommerceSettingsCache();
	});

	it('creates the singleton via upsert when it does not exist', async () => {
		const data = await updateEcommerceSettings({ currency: 'PEN' });

		expect(data.currency).toBe('PEN');
		const doc = await EcommerceSettingsModel.findOne({ id: 'singleton' });
		expect(doc).not.toBeNull();
	});

	it('updates one field without touching the others', async () => {
		await EcommerceSettingsModel.create({
			id: 'singleton',
			currency: 'USD',
			taxPercentage: 10,
		});

		await updateEcommerceSettings({ taxPercentage: 18 });

		const doc = await EcommerceSettingsModel.findOne({
			id: 'singleton',
		}).lean();
		expect(doc!.taxPercentage).toBe(18);
		expect(doc!.currency).toBe('USD');
	});

	it('flattens a partial storeOriginAddress update so sibling fields survive', async () => {
		await updateEcommerceSettings({
			storeOriginAddress: { country: 'PE', region: 'Lima' },
		});

		await updateEcommerceSettings({
			storeOriginAddress: { province: 'Lima' },
		});

		const doc = await EcommerceSettingsModel.findOne({
			id: 'singleton',
		}).lean();
		expect(doc!.storeOriginAddress.country).toBe('PE');
		expect(doc!.storeOriginAddress.region).toBe('Lima');
		expect(doc!.storeOriginAddress.province).toBe('Lima');
	});

	it('clears the read cache after updating', async () => {
		await getEcommerceSettings();

		await updateEcommerceSettings({ currency: 'EUR' });

		const fresh = await getEcommerceSettings();
		expect(fresh.currency).toBe('EUR');
	});
});
