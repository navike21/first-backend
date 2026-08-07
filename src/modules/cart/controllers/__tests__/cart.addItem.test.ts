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
vi.mock('@Modules/cart/application/addCartItem', () => ({
	addCartItem: vi.fn(),
}));

import { cartAddItemController } from '@Modules/cart/controllers/cart.addItem';
import { addCartItem } from '@Modules/cart/application/addCartItem';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

const productId = '11111111-1111-4111-8111-111111111111';

describe('cartAddItemController', () => {
	it('validates the body and adds the item', async () => {
		vi.mocked(addCartItem).mockResolvedValue({
			toObject: () => ({ id: 'cart-1', items: [] }),
		} as never);
		const req = {
			body: { productId, quantity: 2 },
		} as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await cartAddItemController(req, res, next);

		expect(addCartItem).toHaveBeenCalledWith(
			'cust-1',
			expect.objectContaining({ productId, quantity: 2 }),
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with a validation error on an invalid body', async () => {
		const req = { body: { quantity: 0 } } as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await cartAddItemController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
