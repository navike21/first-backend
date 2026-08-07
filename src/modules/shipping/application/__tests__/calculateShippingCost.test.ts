import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import ShippingRuleModel from '@Modules/shipping/infrastructure/ShippingRuleModel';
import { calculateShippingCost } from '@Modules/shipping/application/calculateShippingCost';
import { ShippingNotAvailableError } from '@Modules/shipping/domain/errors/ShippingErrors';

withMongo();

function subtotal(amount: number) {
	return { amount, currency: 'USD' };
}

describe('calculateShippingCost', () => {
	it('throws ShippingNotAvailableError when there are no active rules', async () => {
		await expect(
			calculateShippingCost({ address: {}, cartSubtotal: subtotal(1000) }),
		).rejects.toBeInstanceOf(ShippingNotAvailableError);
	});

	it('ignores inactive and soft-deleted rules', async () => {
		await ShippingRuleModel.create({
			name: 'Inactive flat',
			type: 'flat',
			amount: subtotal(500),
			isActive: false,
			order: 0,
		});
		await ShippingRuleModel.create({
			name: 'Deleted flat',
			type: 'flat',
			amount: subtotal(500),
			isActive: true,
			order: 1,
			deletedAt: new Date(),
		});

		await expect(
			calculateShippingCost({ address: {}, cartSubtotal: subtotal(1000) }),
		).rejects.toBeInstanceOf(ShippingNotAvailableError);
	});

	it('a flat rule always applies regardless of address', async () => {
		const rule = await ShippingRuleModel.create({
			name: 'Flat rate',
			type: 'flat',
			amount: subtotal(1500),
			isActive: true,
			order: 0,
		});

		const result = await calculateShippingCost({
			address: {},
			cartSubtotal: subtotal(1000),
		});
		expect(result).toEqual({ shippingRuleId: rule.id, shippingCost: subtotal(1500) });
	});

	it('free_over_threshold charges the fee below the threshold', async () => {
		await ShippingRuleModel.create({
			name: 'Free over 150',
			type: 'free_over_threshold',
			amount: subtotal(1000),
			freeOverAmount: subtotal(15000),
			isActive: true,
			order: 0,
		});

		const result = await calculateShippingCost({
			address: {},
			cartSubtotal: subtotal(10000),
		});
		expect(result.shippingCost).toEqual(subtotal(1000));
	});

	it('free_over_threshold waives the fee at or above the threshold', async () => {
		await ShippingRuleModel.create({
			name: 'Free over 150',
			type: 'free_over_threshold',
			amount: subtotal(1000),
			freeOverAmount: subtotal(15000),
			isActive: true,
			order: 0,
		});

		const result = await calculateShippingCost({
			address: {},
			cartSubtotal: subtotal(15000),
		});
		expect(result.shippingCost).toEqual({ amount: 0, currency: 'USD' });
	});

	it('a by_zone rule applies only when the address region matches', async () => {
		const rule = await ShippingRuleModel.create({
			name: 'Lima zone',
			type: 'by_zone',
			amount: subtotal(800),
			zones: [{ region: 'Lima' }],
			isActive: true,
			order: 0,
		});

		const match = await calculateShippingCost({
			address: { region: 'Lima' },
			cartSubtotal: subtotal(1000),
		});
		expect(match).toEqual({ shippingRuleId: rule.id, shippingCost: subtotal(800) });

		await expect(
			calculateShippingCost({
				address: { region: 'Cusco' },
				cartSubtotal: subtotal(1000),
			}),
		).rejects.toBeInstanceOf(ShippingNotAvailableError);
	});

	it('a by_zone rule scoped to specific provinces only matches those provinces', async () => {
		await ShippingRuleModel.create({
			name: 'Lima province only',
			type: 'by_zone',
			amount: subtotal(800),
			zones: [{ region: 'Lima', provinces: ['Lima'] }],
			isActive: true,
			order: 0,
		});

		const matched = await calculateShippingCost({
			address: { region: 'Lima', province: 'Lima' },
			cartSubtotal: subtotal(1000),
		});
		expect(matched.shippingCost).toEqual(subtotal(800));

		await expect(
			calculateShippingCost({
				address: { region: 'Lima', province: 'Huaral' },
				cartSubtotal: subtotal(1000),
			}),
		).rejects.toBeInstanceOf(ShippingNotAvailableError);
	});

	it('falls through a non-matching by_zone rule to the next applicable rule in order', async () => {
		await ShippingRuleModel.create({
			name: 'Lima zone',
			type: 'by_zone',
			amount: subtotal(800),
			zones: [{ region: 'Lima' }],
			isActive: true,
			order: 0,
		});
		const fallback = await ShippingRuleModel.create({
			name: 'National flat',
			type: 'flat',
			amount: subtotal(2000),
			isActive: true,
			order: 1,
		});

		const result = await calculateShippingCost({
			address: { region: 'Cusco' },
			cartSubtotal: subtotal(1000),
		});
		expect(result).toEqual({
			shippingRuleId: fallback.id,
			shippingCost: subtotal(2000),
		});
	});

	it('respects rule order — the first applicable rule wins', async () => {
		const first = await ShippingRuleModel.create({
			name: 'First flat',
			type: 'flat',
			amount: subtotal(500),
			isActive: true,
			order: 0,
		});
		await ShippingRuleModel.create({
			name: 'Second flat',
			type: 'flat',
			amount: subtotal(999),
			isActive: true,
			order: 1,
		});

		const result = await calculateShippingCost({
			address: {},
			cartSubtotal: subtotal(1000),
		});
		expect(result.shippingRuleId).toBe(first.id);
	});
});
