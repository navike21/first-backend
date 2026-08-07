import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import PaymentMethodModel from '@Modules/payments/infrastructure/PaymentMethodModel';

describe('PaymentMethodModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(PaymentMethodModel).toBeDefined();
		expect(typeof PaymentMethodModel.find).toBe('function');
		expect(typeof PaymentMethodModel.findOne).toBe('function');
		expect(typeof PaymentMethodModel.create).toBe('function');
	});
});
