import { describe, it, expect, vi } from 'vitest';
import type { Request } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/wishlist/application/getOrCreateWishlist', () => ({
	getOrCreateWishlist: vi.fn(),
}));

import { wishlistGetController } from '@Modules/wishlist/controllers/wishlist.get';
import { getOrCreateWishlist } from '@Modules/wishlist/application/getOrCreateWishlist';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('wishlistGetController', () => {
	it('fetches the wishlist for the authenticated customer', async () => {
		vi.mocked(getOrCreateWishlist).mockResolvedValue({
			toObject: () => ({ id: 'wl-1', customerId: 'cust-1', productIds: [] }),
		} as never);
		const req = {} as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await wishlistGetController(req, res, next);

		expect(getOrCreateWishlist).toHaveBeenCalledWith('cust-1');
		expect(successResponse).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});
});
