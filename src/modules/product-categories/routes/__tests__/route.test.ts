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
vi.mock(
	'@Modules/product-categories/application/createProductCategory',
	() => ({
		createProductCategory: vi.fn(),
	}),
);
vi.mock(
	'@Modules/product-categories/application/updateProductCategory',
	() => ({
		updateProductCategory: vi.fn(),
	}),
);
vi.mock(
	'@Modules/product-categories/application/getProductCategoryById',
	() => ({
		getProductCategoryById: vi.fn(),
	}),
);
vi.mock(
	'@Modules/product-categories/application/listProductCategories',
	() => ({
		listProductCategories: vi.fn(),
	}),
);
vi.mock(
	'@Modules/product-categories/application/deleteProductCategory',
	() => ({
		deleteProductCategory: vi.fn(),
	}),
);
vi.mock('@Modules/product-categories/application/purgeProductCategory', () => ({
	purgeProductCategory: vi.fn(),
}));
vi.mock(
	'@Modules/product-categories/application/restoreProductCategory',
	() => ({
		restoreProductCategory: vi.fn(),
	}),
);
vi.mock(
	'@Modules/product-categories/application/listDeletedProductCategories',
	() => ({
		listDeletedProductCategories: vi.fn(),
	}),
);
vi.mock(
	'@Modules/product-categories/application/deleteProductCategoriesBulk',
	() => ({
		deleteProductCategoriesBulk: vi.fn(),
	}),
);
vi.mock(
	'@Modules/product-categories/application/restoreProductCategoriesBulk',
	() => ({
		restoreProductCategoriesBulk: vi.fn(),
	}),
);
vi.mock(
	'@Modules/product-categories/application/purgeProductCategoriesBulk',
	() => ({
		purgeProductCategoriesBulk: vi.fn(),
	}),
);

import { Router } from 'express';
import { productCategoriesApi } from '@Modules/product-categories/routes/route';

describe('productCategoriesApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => productCategoriesApi(router)).not.toThrow();
	});
});
