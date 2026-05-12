import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import PageModel from '@Modules/pages/infrastructure/PageModel';

describe('PageModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(PageModel).toBeDefined();
		expect(typeof PageModel.find).toBe('function');
		expect(typeof PageModel.findOne).toBe('function');
		expect(typeof PageModel.create).toBe('function');
	});
});
