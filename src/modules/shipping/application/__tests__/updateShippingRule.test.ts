import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createShippingRule } from '@Modules/shipping/application/createShippingRule';
import { updateShippingRule } from '@Modules/shipping/application/updateShippingRule';
import { ShippingRuleNotFoundError } from '@Modules/shipping/domain/errors/ShippingErrors';

withMongo();

const basePayload = {
	name: 'Standard shipping',
	type: 'flat' as const,
	amount: { amount: 1000, currency: 'USD' },
	zones: [],
	isActive: true,
	order: 0,
};

describe('updateShippingRule', () => {
	it('throws ShippingRuleNotFoundError for a missing rule', async () => {
		await expect(
			updateShippingRule(crypto.randomUUID(), { isActive: false }),
		).rejects.toBeInstanceOf(ShippingRuleNotFoundError);
	});

	it('updates fields on an existing rule', async () => {
		const created = await createShippingRule(basePayload);
		const updated = await updateShippingRule(created.id, { order: 5 });
		expect(updated.order).toBe(5);
	});

	it('leaves unspecified fields untouched on a partial update', async () => {
		const created = await createShippingRule(basePayload);
		const updated = await updateShippingRule(created.id, { isActive: false });
		expect(updated.isActive).toBe(false);
		expect(updated.name).toBe('Standard shipping');
	});
});
