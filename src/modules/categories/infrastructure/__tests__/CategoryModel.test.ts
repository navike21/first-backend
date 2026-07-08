import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import CategoryModel from '@Modules/categories/infrastructure/CategoryModel';

describe('CategoryModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(CategoryModel).toBeDefined();
		expect(typeof CategoryModel.find).toBe('function');
		expect(typeof CategoryModel.findOne).toBe('function');
		expect(typeof CategoryModel.create).toBe('function');
	});
});
