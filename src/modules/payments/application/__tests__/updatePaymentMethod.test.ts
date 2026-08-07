import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createPaymentMethod } from '@Modules/payments/application/createPaymentMethod';
import { updatePaymentMethod } from '@Modules/payments/application/updatePaymentMethod';
import { PaymentMethodNotFoundError } from '@Modules/payments/domain/errors/PaymentErrors';

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

describe('updatePaymentMethod', () => {
	it('throws PaymentMethodNotFoundError for a missing payment method', async () => {
		await expect(
			updatePaymentMethod(crypto.randomUUID(), { isDefault: true }),
		).rejects.toBeInstanceOf(PaymentMethodNotFoundError);
	});

	it('updates fields on an existing payment method', async () => {
		const created = await createPaymentMethod(basePayload);
		const updated = await updatePaymentMethod(created.id, { isDefault: true });
		expect(updated.isDefault).toBe(true);
	});

	it('leaves unspecified fields untouched on a partial update', async () => {
		const created = await createPaymentMethod(basePayload);
		const updated = await updatePaymentMethod(created.id, { brand: 'Visa Debit' });
		expect(updated.brand).toBe('Visa Debit');
		expect(updated.last4).toBe('4242');
	});
});
