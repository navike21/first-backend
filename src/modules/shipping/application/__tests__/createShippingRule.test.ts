import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createShippingRule } from '@Modules/shipping/application/createShippingRule';

withMongo();

const basePayload = {
	name: 'Standard shipping',
	type: 'flat' as const,
	amount: { amount: 1000, currency: 'USD' },
	zones: [],
	isActive: true,
	order: 0,
};

describe('createShippingRule', () => {
	it('creates a flat shipping rule', async () => {
		const result = await createShippingRule(basePayload);
		expect(result.name).toBe('Standard shipping');
		expect(result.type).toBe('flat');
		expect(result.isActive).toBe(true);
	});

	it('creates a by_zone rule with zones', async () => {
		const result = await createShippingRule({
			...basePayload,
			type: 'by_zone',
			zones: [{ region: 'Lima', provinces: ['Lima'] }],
		});
		expect(result.zones).toEqual([{ region: 'Lima', provinces: ['Lima'] }]);
	});
});
