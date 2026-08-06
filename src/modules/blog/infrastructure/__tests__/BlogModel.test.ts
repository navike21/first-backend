import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import BlogModel from '@Modules/blog/infrastructure/BlogModel';

describe('BlogModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(BlogModel).toBeDefined();
		expect(typeof BlogModel.find).toBe('function');
		expect(typeof BlogModel.findOne).toBe('function');
		expect(typeof BlogModel.create).toBe('function');
	});
});
