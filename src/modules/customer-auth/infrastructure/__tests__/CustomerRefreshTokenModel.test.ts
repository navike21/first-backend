import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import CustomerRefreshTokenModel from '@Modules/customer-auth/infrastructure/CustomerRefreshTokenModel';

describe('CustomerRefreshTokenModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(CustomerRefreshTokenModel).toBeDefined();
		expect(typeof CustomerRefreshTokenModel.find).toBe('function');
		expect(typeof CustomerRefreshTokenModel.create).toBe('function');
	});
});
