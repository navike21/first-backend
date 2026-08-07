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
vi.mock('@Modules/cart/application/removeCartItem', () => ({
	removeCartItem: vi.fn(),
}));

import { cartRemoveItemController } from '@Modules/cart/controllers/cart.removeItem';
import { removeCartItem } from '@Modules/cart/application/removeCartItem';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

const productId = '11111111-1111-4111-8111-111111111111';

describe('cartRemoveItemController', () => {
	it('removes the line for a simple product (no body)', async () => {
		vi.mocked(removeCartItem).mockResolvedValue({
			toObject: () => ({ id: 'cart-1', items: [] }),
		} as never);
		const req = { params: { productId }, body: undefined } as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await cartRemoveItemController(req, res, next);

		expect(removeCartItem).toHaveBeenCalledWith('cust-1', productId, {});
		expect(successResponse).toHaveBeenCalled();
	});

	it('removes the line for a specific variant', async () => {
		const variantId = '22222222-2222-4222-8222-222222222222';
		vi.mocked(removeCartItem).mockResolvedValue({
			toObject: () => ({ id: 'cart-1', items: [] }),
		} as never);
		const req = {
			params: { productId },
			body: { variantId },
		} as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await cartRemoveItemController(req, res, next);

		expect(removeCartItem).toHaveBeenCalledWith('cust-1', productId, {
			variantId,
		});
	});
});
