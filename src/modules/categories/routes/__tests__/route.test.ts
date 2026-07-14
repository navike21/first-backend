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
vi.mock('@Modules/categories/application/createCategory', () => ({
	createCategory: vi.fn(),
}));
vi.mock('@Modules/categories/application/updateCategory', () => ({
	updateCategory: vi.fn(),
}));
vi.mock('@Modules/categories/application/getCategoryById', () => ({
	getCategoryById: vi.fn(),
}));
vi.mock('@Modules/categories/application/listCategories', () => ({
	listCategories: vi.fn(),
}));
vi.mock('@Modules/categories/application/deleteCategory', () => ({
	deleteCategory: vi.fn(),
}));
vi.mock('@Modules/categories/application/purgeCategory', () => ({
	purgeCategory: vi.fn(),
}));
vi.mock('@Modules/categories/application/restoreCategory', () => ({
	restoreCategory: vi.fn(),
}));
vi.mock('@Modules/categories/application/listDeletedCategories', () => ({
	listDeletedCategories: vi.fn(),
}));
vi.mock('@Modules/categories/application/deleteCategoriesBulk', () => ({
	deleteCategoriesBulk: vi.fn(),
}));
vi.mock('@Modules/categories/application/restoreCategoriesBulk', () => ({
	restoreCategoriesBulk: vi.fn(),
}));
vi.mock('@Modules/categories/application/purgeCategoriesBulk', () => ({
	purgeCategoriesBulk: vi.fn(),
}));

import { Router } from 'express';
import { categoriesApi } from '@Modules/categories/routes/route';

describe('categoriesApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => categoriesApi(router)).not.toThrow();
	});
});
