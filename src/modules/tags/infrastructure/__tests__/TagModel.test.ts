import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import TagModel from '@Modules/tags/infrastructure/TagModel';

describe('TagModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(TagModel).toBeDefined();
		expect(typeof TagModel.find).toBe('function');
		expect(typeof TagModel.findOne).toBe('function');
		expect(typeof TagModel.create).toBe('function');
	});
});
