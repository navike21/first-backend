import { describe, it, expect } from 'vitest';
import { WishlistProductParamSchema } from '@Modules/wishlist/schemas/wishlist.schema';

describe('WishlistProductParamSchema', () => {
	it('accepts a valid uuid', () => {
		const result = WishlistProductParamSchema.safeParse({
			productId: '11111111-1111-4111-8111-111111111111',
		});
		expect(result.success).toBe(true);
	});

	it('rejects an invalid uuid', () => {
		const result = WishlistProductParamSchema.safeParse({
			productId: 'not-a-uuid',
		});
		expect(result.success).toBe(false);
	});
});
