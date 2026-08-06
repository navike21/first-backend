import { describe, it, expect } from 'vitest';
import { EcommerceSettingsUpdateSchema } from '../ecommerceSettings.schema';

describe('EcommerceSettingsUpdateSchema', () => {
	it('accepts a valid currency update', () => {
		const result = EcommerceSettingsUpdateSchema.safeParse({
			currency: 'pen',
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.currency).toBe('PEN');
	});

	it('rejects a currency that is not 3 characters', () => {
		const result = EcommerceSettingsUpdateSchema.safeParse({
			currency: 'SOLES',
		});
		expect(result.success).toBe(false);
	});

	it('accepts a valid taxPercentage', () => {
		const result = EcommerceSettingsUpdateSchema.safeParse({
			taxPercentage: 18,
		});
		expect(result.success).toBe(true);
	});

	it('rejects a taxPercentage above 100', () => {
		const result = EcommerceSettingsUpdateSchema.safeParse({
			taxPercentage: 101,
		});
		expect(result.success).toBe(false);
	});

	it('rejects a negative taxPercentage', () => {
		const result = EcommerceSettingsUpdateSchema.safeParse({
			taxPercentage: -1,
		});
		expect(result.success).toBe(false);
	});

	it('accepts a partial storeOriginAddress', () => {
		const result = EcommerceSettingsUpdateSchema.safeParse({
			storeOriginAddress: { country: 'pe', region: 'Lima' },
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.storeOriginAddress?.country).toBe('PE');
		}
	});

	it('rejects a truly empty update (no keys at all)', () => {
		const result = EcommerceSettingsUpdateSchema.safeParse({});
		expect(result.success).toBe(false);
	});
});
