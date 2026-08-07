import { describe, it, expect } from 'vitest';
import { updatePaymentProviderConfigSchemaFor } from '@Modules/payments/schemas/paymentProviderConfig.schema';

describe('updatePaymentProviderConfigSchemaFor', () => {
	it('rejects an empty update', () => {
		const result = updatePaymentProviderConfigSchemaFor('culqi').safeParse({});
		expect(result.success).toBe(false);
	});

	it('accepts enabling with no config change', () => {
		const result = updatePaymentProviderConfigSchemaFor('culqi').safeParse({
			enabled: true,
		});
		expect(result.success).toBe(true);
	});

	it('rejects a culqi config missing required fields', () => {
		const result = updatePaymentProviderConfigSchemaFor('culqi').safeParse({
			config: { publicKey: 'pk_test' },
		});
		expect(result.success).toBe(false);
	});

	it('accepts a complete culqi config', () => {
		const result = updatePaymentProviderConfigSchemaFor('culqi').safeParse({
			config: { publicKey: 'pk_test', secretKey: 'sk_test' },
		});
		expect(result.success).toBe(true);
	});

	it('rejects an unknown config key', () => {
		const result = updatePaymentProviderConfigSchemaFor('culqi').safeParse({
			config: { publicKey: 'pk_test', secretKey: 'sk_test', extra: 'nope' },
		});
		expect(result.success).toBe(false);
	});

	it('accepts an empty config object for manual (no fields required)', () => {
		const result = updatePaymentProviderConfigSchemaFor('manual').safeParse({
			config: {},
		});
		expect(result.success).toBe(true);
	});
});
