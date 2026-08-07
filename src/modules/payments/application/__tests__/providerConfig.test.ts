import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { listPaymentProviderConfigs } from '@Modules/payments/application/listPaymentProviderConfigs';
import { upsertPaymentProviderConfig } from '@Modules/payments/application/upsertPaymentProviderConfig';
import PaymentProviderConfigModel from '@Modules/payments/infrastructure/PaymentProviderConfigModel';

withMongo();

describe('listPaymentProviderConfigs', () => {
	it('returns all 4 known providers with defaults when nothing is saved', async () => {
		const configs = await listPaymentProviderConfigs();
		expect(configs).toHaveLength(4);
		expect(new Set(configs.map((c) => c.provider))).toEqual(
			new Set(['culqi', 'manual', 'mercadopago', 'stripe']),
		);
		const culqi = configs.find((c) => c.provider === 'culqi');
		expect(culqi).toMatchObject({ enabled: false, isDefault: false, config: {} });
	});

	it('never includes password-type fields in the returned config', async () => {
		await PaymentProviderConfigModel.create({
			provider: 'culqi',
			enabled: true,
			config: { publicKey: 'pk_test', secretKey: 'sk_super_secret' },
		});

		const configs = await listPaymentProviderConfigs();
		const culqi = configs.find((c) => c.provider === 'culqi');
		expect(culqi?.config).toEqual({ publicKey: 'pk_test' });
		expect(culqi?.config).not.toHaveProperty('secretKey');
	});
});

describe('upsertPaymentProviderConfig', () => {
	it('creates a config row on first update (upsert)', async () => {
		const result = await upsertPaymentProviderConfig('stripe', { enabled: true });
		expect(result.enabled).toBe(true);
		expect(result.provider).toBe('stripe');

		const doc = await PaymentProviderConfigModel.findOne({ provider: 'stripe' }).lean();
		expect(doc).not.toBeNull();
	});

	it('updates an existing row rather than creating a duplicate', async () => {
		await upsertPaymentProviderConfig('mercadopago', { enabled: true });
		await upsertPaymentProviderConfig('mercadopago', { isDefault: true });

		const count = await PaymentProviderConfigModel.countDocuments({
			provider: 'mercadopago',
		});
		expect(count).toBe(1);

		const doc = await PaymentProviderConfigModel.findOne({
			provider: 'mercadopago',
		}).lean();
		expect(doc).toMatchObject({ enabled: true, isDefault: true });
	});

	it('setting config replaces the stored config wholesale', async () => {
		await upsertPaymentProviderConfig('culqi', {
			config: { publicKey: 'pk_1', secretKey: 'sk_1' },
		});
		await upsertPaymentProviderConfig('culqi', {
			config: { publicKey: 'pk_2', secretKey: 'sk_2' },
		});

		const doc = await PaymentProviderConfigModel.findOne({ provider: 'culqi' }).lean();
		expect(doc?.config).toEqual({ publicKey: 'pk_2', secretKey: 'sk_2' });
	});

	it('strips secret fields from the returned view even right after saving them', async () => {
		const result = await upsertPaymentProviderConfig('stripe', {
			config: { publishableKey: 'pk_live', secretKey: 'sk_live' },
		});
		expect(result.config).toEqual({ publishableKey: 'pk_live' });
	});
});
