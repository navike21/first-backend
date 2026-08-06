import { describe, it, expect } from 'vitest';
import { MoneySchema } from '@Shared/schemas/money.schema';

describe('MoneySchema', () => {
	it('parses a valid money value', () => {
		const result = MoneySchema.safeParse({ amount: 1999, currency: 'pen' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.amount).toBe(1999);
			expect(result.data.currency).toBe('PEN');
		}
	});

	it('rejects a negative amount', () => {
		const result = MoneySchema.safeParse({ amount: -1, currency: 'PEN' });
		expect(result.success).toBe(false);
	});

	it('rejects a non-integer amount', () => {
		const result = MoneySchema.safeParse({ amount: 19.99, currency: 'PEN' });
		expect(result.success).toBe(false);
	});

	it('rejects a currency code that is not 3 characters', () => {
		const result = MoneySchema.safeParse({ amount: 100, currency: 'SOL' + 'X' });
		expect(result.success).toBe(false);
	});

	it('accepts amount 0', () => {
		const result = MoneySchema.safeParse({ amount: 0, currency: 'USD' });
		expect(result.success).toBe(true);
	});
});
