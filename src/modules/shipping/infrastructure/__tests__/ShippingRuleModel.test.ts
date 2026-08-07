import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import ShippingRuleModel from '@Modules/shipping/infrastructure/ShippingRuleModel';

describe('ShippingRuleModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(ShippingRuleModel).toBeDefined();
		expect(typeof ShippingRuleModel.find).toBe('function');
		expect(typeof ShippingRuleModel.findOne).toBe('function');
		expect(typeof ShippingRuleModel.create).toBe('function');
	});
});
