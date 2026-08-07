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
vi.mock('@Modules/wishlist/application/getOrCreateWishlist', () => ({
	getOrCreateWishlist: vi.fn(),
}));
vi.mock('@Modules/wishlist/application/addWishlistItem', () => ({
	addWishlistItem: vi.fn(),
}));
vi.mock('@Modules/wishlist/application/removeWishlistItem', () => ({
	removeWishlistItem: vi.fn(),
}));

import { Router } from 'express';
import { wishlistApi } from '@Modules/wishlist/routes/route';

describe('wishlistApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => wishlistApi(router)).not.toThrow();
	});
});
