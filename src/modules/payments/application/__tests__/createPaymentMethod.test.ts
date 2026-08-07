import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createPaymentMethod } from '@Modules/payments/application/createPaymentMethod';

withMongo();

const customerId = '11111111-1111-4111-8111-111111111111';

const basePayload = {
	customerId,
	provider: 'stripe' as const,
	providerToken: 'tok_visa',
	brand: 'Visa',
	last4: '4242',
	expiryMonth: 12,
	expiryYear: 2030,
	isDefault: false,
};

describe('createPaymentMethod', () => {
	it('creates a payment method', async () => {
		const result = await createPaymentMethod(basePayload);
		expect(result.customerId).toBe(customerId);
		expect(result.brand).toBe('Visa');
		expect(result.last4).toBe('4242');
	});

	it('allows two payment methods for the same customer', async () => {
		await createPaymentMethod(basePayload);
		await expect(
			createPaymentMethod({ ...basePayload, providerToken: 'tok_mastercard' }),
		).resolves.toMatchObject({ customerId });
	});
});
