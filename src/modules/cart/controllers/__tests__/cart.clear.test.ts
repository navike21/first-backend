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
vi.mock('@Modules/cart/application/clearCart', () => ({
	clearCart: vi.fn(),
}));

import { cartClearController } from '@Modules/cart/controllers/cart.clear';
import { clearCart } from '@Modules/cart/application/clearCart';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('cartClearController', () => {
	it('empties the cart for the authenticated customer', async () => {
		vi.mocked(clearCart).mockResolvedValue({
			toObject: () => ({ id: 'cart-1', items: [] }),
		} as never);
		const req = {} as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await cartClearController(req, res, next);

		expect(clearCart).toHaveBeenCalledWith('cust-1');
		expect(successResponse).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});
});
