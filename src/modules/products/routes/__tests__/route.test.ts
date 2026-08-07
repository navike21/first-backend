import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyAccess: vi.fn() },
}));
vi.mock('@Modules/products/application/createProduct', () => ({
	createProduct: vi.fn(),
}));
vi.mock('@Modules/products/application/updateProduct', () => ({
	updateProduct: vi.fn(),
}));
vi.mock('@Modules/products/application/deleteProductLogical', () => ({
	deleteProductLogical: vi.fn(),
}));
vi.mock('@Modules/products/application/deleteProductPhysical', () => ({
	deleteProductPhysical: vi.fn(),
}));
vi.mock('@Modules/products/application/restoreProduct', () => ({
	restoreProduct: vi.fn(),
}));
vi.mock('@Modules/products/application/getProductById', () => ({
	getProductById: vi.fn(),
}));
vi.mock('@Modules/products/application/getProductBySlug', () => ({
	getProductBySlug: vi.fn(),
}));
vi.mock('@Modules/products/application/listProductsAdmin', () => ({
	listProductsAdmin: vi.fn(),
}));
vi.mock('@Modules/products/application/listProductsPublic', () => ({
	listProductsPublic: vi.fn(),
}));
vi.mock('@Modules/products/application/listDeletedProducts', () => ({
	listDeletedProducts: vi.fn(),
}));
vi.mock('@Modules/products/application/deleteProductsBulk', () => ({
	deleteProductsBulk: vi.fn(),
}));
vi.mock('@Modules/products/application/restoreProductsBulk', () => ({
	restoreProductsBulk: vi.fn(),
}));
vi.mock('@Modules/products/application/purgeProductsBulk', () => ({
	purgeProductsBulk: vi.fn(),
}));

import { Router } from 'express';
import { productsApi } from '@Modules/products/routes/route';

describe('productsApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => productsApi(router)).not.toThrow();
	});
});
