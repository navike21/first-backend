import { describe, it, expect } from 'vitest';
import {
	CreatePaymentMethodSchema,
	UpdatePaymentMethodSchema,
} from '@Modules/payments/schemas/paymentMethod.schema';

const customerId = '11111111-1111-4111-8111-111111111111';

function baseInput(overrides: Record<string, unknown> = {}) {
	return {
		customerId,
		provider: 'stripe',
		providerToken: 'tok_visa',
		brand: 'Visa',
		last4: '4242',
		expiryMonth: 12,
		expiryYear: 2030,
		...overrides,
	};
}

describe('CreatePaymentMethodSchema', () => {
	it('accepts a minimal valid payment method', () => {
		const result = CreatePaymentMethodSchema.safeParse(baseInput());
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.isDefault).toBe(false);
	});

	it('rejects an invalid provider', () => {
		const result = CreatePaymentMethodSchema.safeParse(baseInput({ provider: 'paypal' }));
		expect(result.success).toBe(false);
	});

	it('rejects a non-4-digit last4', () => {
		const result = CreatePaymentMethodSchema.safeParse(baseInput({ last4: '42' }));
		expect(result.success).toBe(false);
	});

	it('rejects an out-of-range expiryMonth', () => {
		const result = CreatePaymentMethodSchema.safeParse(baseInput({ expiryMonth: 13 }));
		expect(result.success).toBe(false);
	});

	it('rejects a missing customerId', () => {
		const { customerId: _customerId, ...rest } = baseInput();
		const result = CreatePaymentMethodSchema.safeParse(rest);
		expect(result.success).toBe(false);
	});
});

describe('UpdatePaymentMethodSchema', () => {
	it('accepts a partial update with a single field', () => {
		const result = UpdatePaymentMethodSchema.safeParse({ isDefault: true });
		expect(result.success).toBe(true);
	});
});
