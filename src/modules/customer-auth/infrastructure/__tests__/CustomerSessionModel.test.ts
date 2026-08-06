import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import CustomerSessionModel from '@Modules/customer-auth/infrastructure/CustomerSessionModel';

describe('CustomerSessionModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(CustomerSessionModel).toBeDefined();
		expect(typeof CustomerSessionModel.find).toBe('function');
		expect(typeof CustomerSessionModel.create).toBe('function');
	});
});
