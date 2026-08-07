import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import WishlistModel from '@Modules/wishlist/infrastructure/WishlistModel';

describe('WishlistModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(WishlistModel).toBeDefined();
		expect(typeof WishlistModel.find).toBe('function');
		expect(typeof WishlistModel.findOne).toBe('function');
		expect(typeof WishlistModel.create).toBe('function');
	});
});
