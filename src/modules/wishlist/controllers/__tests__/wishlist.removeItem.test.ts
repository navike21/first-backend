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
vi.mock('@Modules/wishlist/application/removeWishlistItem', () => ({
	removeWishlistItem: vi.fn(),
}));

import { wishlistRemoveItemController } from '@Modules/wishlist/controllers/wishlist.removeItem';
import { removeWishlistItem } from '@Modules/wishlist/application/removeWishlistItem';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

const productId = '11111111-1111-4111-8111-111111111111';

describe('wishlistRemoveItemController', () => {
	it('validates the param and removes the product', async () => {
		vi.mocked(removeWishlistItem).mockResolvedValue({
			toObject: () => ({ id: 'wl-1', productIds: [] }),
		} as never);
		const req = { params: { productId } } as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await wishlistRemoveItemController(req, res, next);

		expect(removeWishlistItem).toHaveBeenCalledWith('cust-1', productId);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with a validation error on an invalid productId', async () => {
		const req = { params: { productId: 'not-a-uuid' } } as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await wishlistRemoveItemController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
