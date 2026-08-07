import { describe, it, expect } from 'vitest';
import {
	CreateShippingRuleSchema,
	UpdateShippingRuleSchema,
} from '@Modules/shipping/schemas/shippingRule.schema';

function baseInput(overrides: Record<string, unknown> = {}) {
	return {
		name: 'Standard shipping',
		type: 'flat',
		amount: { amount: 1000, currency: 'USD' },
		...overrides,
	};
}

describe('CreateShippingRuleSchema', () => {
	it('accepts a minimal valid flat rule', () => {
		const result = CreateShippingRuleSchema.safeParse(baseInput());
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.isActive).toBe(true);
			expect(result.data.order).toBe(0);
		}
	});

	it('rejects free_over_threshold without freeOverAmount', () => {
		const result = CreateShippingRuleSchema.safeParse(
			baseInput({ type: 'free_over_threshold' }),
		);
		expect(result.success).toBe(false);
	});

	it('accepts free_over_threshold with freeOverAmount', () => {
		const result = CreateShippingRuleSchema.safeParse(
			baseInput({
				type: 'free_over_threshold',
				freeOverAmount: { amount: 15000, currency: 'USD' },
			}),
		);
		expect(result.success).toBe(true);
	});

	it('rejects freeOverAmount on a flat rule', () => {
		const result = CreateShippingRuleSchema.safeParse(
			baseInput({ freeOverAmount: { amount: 15000, currency: 'USD' } }),
		);
		expect(result.success).toBe(false);
	});

	it('rejects by_zone with no zones', () => {
		const result = CreateShippingRuleSchema.safeParse(baseInput({ type: 'by_zone' }));
		expect(result.success).toBe(false);
	});

	it('accepts by_zone with at least one zone', () => {
		const result = CreateShippingRuleSchema.safeParse(
			baseInput({ type: 'by_zone', zones: [{ region: 'Lima' }] }),
		);
		expect(result.success).toBe(true);
	});

	it('accepts a zone with a provinces list', () => {
		const result = CreateShippingRuleSchema.safeParse(
			baseInput({
				type: 'by_zone',
				zones: [{ region: 'Lima', provinces: ['Lima', 'Callao'] }],
			}),
		);
		expect(result.success).toBe(true);
	});

	it('rejects a missing name', () => {
		const { name: _name, ...rest } = baseInput();
		const result = CreateShippingRuleSchema.safeParse(rest);
		expect(result.success).toBe(false);
	});

	it('rejects an invalid type', () => {
		const result = CreateShippingRuleSchema.safeParse(baseInput({ type: 'courier' }));
		expect(result.success).toBe(false);
	});
});

describe('UpdateShippingRuleSchema', () => {
	it('accepts a partial update with a single field', () => {
		const result = UpdateShippingRuleSchema.safeParse({ isActive: false });
		expect(result.success).toBe(true);
	});

	it('still enforces the zonesRequiredForByZone refinement on partial input', () => {
		const result = UpdateShippingRuleSchema.safeParse({ type: 'by_zone', zones: [] });
		expect(result.success).toBe(false);
	});
});
