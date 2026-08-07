import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import CouponModel from '@Modules/coupons/infrastructure/CouponModel';

describe('CouponModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(CouponModel).toBeDefined();
		expect(typeof CouponModel.find).toBe('function');
		expect(typeof CouponModel.findOne).toBe('function');
		expect(typeof CouponModel.create).toBe('function');
	});
});
