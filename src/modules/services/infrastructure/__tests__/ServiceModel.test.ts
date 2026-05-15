import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import ServiceModel from '@Modules/services/infrastructure/ServiceModel';

describe('ServiceModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(ServiceModel).toBeDefined();
		expect(typeof ServiceModel.find).toBe('function');
		expect(typeof ServiceModel.findOne).toBe('function');
		expect(typeof ServiceModel.create).toBe('function');
	});
});
