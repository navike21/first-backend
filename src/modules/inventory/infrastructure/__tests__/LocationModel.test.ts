import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import LocationModel from '@Modules/inventory/infrastructure/LocationModel';

describe('LocationModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(LocationModel).toBeDefined();
		expect(typeof LocationModel.find).toBe('function');
		expect(typeof LocationModel.findOne).toBe('function');
		expect(typeof LocationModel.create).toBe('function');
	});
});
