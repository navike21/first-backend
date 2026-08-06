import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import CustomerModel from '@Modules/customers/infrastructure/CustomerModel';

describe('CustomerModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(CustomerModel).toBeDefined();
		expect(typeof CustomerModel.find).toBe('function');
		expect(typeof CustomerModel.findOne).toBe('function');
		expect(typeof CustomerModel.create).toBe('function');
	});
});
