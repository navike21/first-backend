import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: {
		NODE_ENV: 'test',
		JWT_CUSTOMER_ACCESS_SECRET: 'test-secret',
	},
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Shared/infrastructure/CustomerJwtService', () => ({
	CustomerJwtService: { verifyAccess: vi.fn() },
}));
vi.mock('@Modules/cart/application/getOrCreateCart', () => ({
	getOrCreateCart: vi.fn(),
}));
vi.mock('@Modules/cart/application/addCartItem', () => ({
	addCartItem: vi.fn(),
}));
vi.mock('@Modules/cart/application/updateCartItemQuantity', () => ({
	updateCartItemQuantity: vi.fn(),
}));
vi.mock('@Modules/cart/application/removeCartItem', () => ({
	removeCartItem: vi.fn(),
}));
vi.mock('@Modules/cart/application/clearCart', () => ({
	clearCart: vi.fn(),
}));

import { Router } from 'express';
import { cartApi } from '@Modules/cart/routes/route';

describe('cartApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => cartApi(router)).not.toThrow();
	});
});
