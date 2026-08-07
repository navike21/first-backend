import { describe, it, expect } from 'vitest';
import {
	CouponNotFoundError,
	CouponCodeConflictError,
	CouponInactiveError,
	CouponNotYetValidError,
	CouponExpiredError,
	CouponUsageLimitReachedError,
	CouponCustomerUsageLimitReachedError,
	CouponNotApplicableError,
} from '@Modules/coupons/domain/errors/CouponErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Coupon domain errors', () => {
	it('CouponNotFoundError has correct code and status', () => {
		const error = new CouponNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('COUPON_NOT_FOUND');
	});

	it('CouponCodeConflictError has correct code and status', () => {
		const error = new CouponCodeConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('RESOURCE_DUPLICATE');
	});

	it('CouponInactiveError has correct code and status', () => {
		const error = new CouponInactiveError();
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('COUPON_INACTIVE');
	});

	it('CouponNotYetValidError has correct code and status', () => {
		const error = new CouponNotYetValidError();
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('COUPON_NOT_YET_VALID');
	});

	it('CouponExpiredError has correct code and status', () => {
		const error = new CouponExpiredError();
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('COUPON_EXPIRED');
	});

	it('CouponUsageLimitReachedError has correct code and status', () => {
		const error = new CouponUsageLimitReachedError();
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('COUPON_USAGE_LIMIT_REACHED');
	});

	it('CouponCustomerUsageLimitReachedError has correct code and status', () => {
		const error = new CouponCustomerUsageLimitReachedError();
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('COUPON_CUSTOMER_USAGE_LIMIT_REACHED');
	});

	it('CouponNotApplicableError has correct code and status', () => {
		const error = new CouponNotApplicableError();
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('COUPON_NOT_APPLICABLE');
	});
});
