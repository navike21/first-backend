import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import PaymentProviderConfigModel from '@Modules/payments/infrastructure/PaymentProviderConfigModel';

describe('PaymentProviderConfigModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(PaymentProviderConfigModel).toBeDefined();
		expect(typeof PaymentProviderConfigModel.find).toBe('function');
		expect(typeof PaymentProviderConfigModel.findOne).toBe('function');
		expect(typeof PaymentProviderConfigModel.findOneAndUpdate).toBe('function');
	});
});
