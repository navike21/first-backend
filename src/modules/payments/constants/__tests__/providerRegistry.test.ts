import { describe, it, expect } from 'vitest';
import {
	PAYMENT_PROVIDER_KEYS,
	PAYMENT_PROVIDER_REGISTRY,
	isKnownPaymentProvider,
} from '@Modules/payments/constants/providerRegistry';

describe('providerRegistry', () => {
	it('has a registry entry for every known provider key', () => {
		for (const key of PAYMENT_PROVIDER_KEYS) {
			expect(PAYMENT_PROVIDER_REGISTRY[key]).toBeDefined();
			expect(PAYMENT_PROVIDER_REGISTRY[key].label).toBeTruthy();
			expect(Array.isArray(PAYMENT_PROVIDER_REGISTRY[key].fields)).toBe(true);
		}
	});

	it('manual provider has no config fields', () => {
		expect(PAYMENT_PROVIDER_REGISTRY.manual.fields).toEqual([]);
	});

	it('isKnownPaymentProvider accepts registry keys and rejects unknown values', () => {
		expect(isKnownPaymentProvider('culqi')).toBe(true);
		expect(isKnownPaymentProvider('stripe')).toBe(true);
		expect(isKnownPaymentProvider('paypal')).toBe(false);
		expect(isKnownPaymentProvider('')).toBe(false);
	});
});
