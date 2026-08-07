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
vi.mock('@Modules/cart/application/getOrCreateCart', () => ({
	getOrCreateCart: vi.fn(),
}));

import { cartGetController } from '@Modules/cart/controllers/cart.get';
import { getOrCreateCart } from '@Modules/cart/application/getOrCreateCart';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('cartGetController', () => {
	it('fetches the cart for the authenticated customer', async () => {
		vi.mocked(getOrCreateCart).mockResolvedValue({
			toObject: () => ({ id: 'cart-1', customerId: 'cust-1', items: [] }),
		} as never);
		const req = {} as unknown as Request;
		const res = makeRes({ customerId: 'cust-1' });
		const next = vi.fn();

		await cartGetController(req, res, next);

		expect(getOrCreateCart).toHaveBeenCalledWith('cust-1');
		expect(successResponse).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});
});
