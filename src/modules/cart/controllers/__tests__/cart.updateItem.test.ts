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
vi.mock('@Modules/cart/application/updateCartItemQuantity', () => ({
	updateCartItemQuantity: vi.fn(),
}));

import { cartUpdateItemController } from '@Modules/cart/controllers/cart.updateItem';
import { updateCartItemQuantity } from '@Modules/cart/application/updateCartItemQuantity';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

const productId = '11111111-1111-4111-8111-111111111111';

describe('cartUpdateItemController', () => {
	it('validates the body and updates the item quantity', async () => {
		vi.mocked(updateCartItemQuantity).mockResolvedValue({
			toObject: () => ({ id: 'cart-1', items: [] }),
		} as never);
		const req = {
			params: { productId },
			body: { quantity: 4 },
		} as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await cartUpdateItemController(req, res, next);

		expect(updateCartItemQuantity).toHaveBeenCalledWith(
			'cust-1',
			productId,
			expect.objectContaining({ quantity: 4 }),
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with a validation error on an invalid body', async () => {
		const req = {
			params: { productId },
			body: {},
		} as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await cartUpdateItemController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
