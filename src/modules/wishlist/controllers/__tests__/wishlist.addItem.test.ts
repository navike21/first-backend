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
vi.mock('@Modules/wishlist/application/addWishlistItem', () => ({
	addWishlistItem: vi.fn(),
}));

import { wishlistAddItemController } from '@Modules/wishlist/controllers/wishlist.addItem';
import { addWishlistItem } from '@Modules/wishlist/application/addWishlistItem';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

const productId = '11111111-1111-4111-8111-111111111111';

describe('wishlistAddItemController', () => {
	it('validates the param and saves the product', async () => {
		vi.mocked(addWishlistItem).mockResolvedValue({
			toObject: () => ({ id: 'wl-1', productIds: [productId] }),
		} as never);
		const req = { params: { productId } } as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await wishlistAddItemController(req, res, next);

		expect(addWishlistItem).toHaveBeenCalledWith('cust-1', productId);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with a validation error on an invalid productId', async () => {
		const req = { params: { productId: 'not-a-uuid' } } as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await wishlistAddItemController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
