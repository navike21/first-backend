import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyAccess: vi.fn() },
}));
vi.mock('@Modules/coupons/application/createCoupon', () => ({
	createCoupon: vi.fn(),
}));
vi.mock('@Modules/coupons/application/updateCoupon', () => ({
	updateCoupon: vi.fn(),
}));
vi.mock('@Modules/coupons/application/deleteCouponLogical', () => ({
	deleteCouponLogical: vi.fn(),
}));
vi.mock('@Modules/coupons/application/deleteCouponPhysical', () => ({
	deleteCouponPhysical: vi.fn(),
}));
vi.mock('@Modules/coupons/application/restoreCoupon', () => ({
	restoreCoupon: vi.fn(),
}));
vi.mock('@Modules/coupons/application/getCouponById', () => ({
	getCouponById: vi.fn(),
}));
vi.mock('@Modules/coupons/application/listCoupons', () => ({
	listCoupons: vi.fn(),
}));
vi.mock('@Modules/coupons/application/listDeletedCoupons', () => ({
	listDeletedCoupons: vi.fn(),
}));
vi.mock('@Modules/coupons/application/deleteCouponsBulk', () => ({
	deleteCouponsBulk: vi.fn(),
}));
vi.mock('@Modules/coupons/application/restoreCouponsBulk', () => ({
	restoreCouponsBulk: vi.fn(),
}));
vi.mock('@Modules/coupons/application/purgeCouponsBulk', () => ({
	purgeCouponsBulk: vi.fn(),
}));

import { Router } from 'express';
import { couponsApi } from '@Modules/coupons/routes/route';

describe('couponsApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => couponsApi(router)).not.toThrow();
	});
});
