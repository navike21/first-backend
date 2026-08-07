import { AppError } from '@Shared/domain/AppError';

export class CouponNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'COUPON_NOT_FOUND',
			message: 'Coupon not found',
		});
	}
}

export class CouponCodeConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'RESOURCE_DUPLICATE',
			message: 'A coupon with this code already exists',
			details: { keys: ['code'] },
		});
	}
}

export class CouponInactiveError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'COUPON_INACTIVE',
			message: 'This coupon is not active',
		});
	}
}

export class CouponNotYetValidError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'COUPON_NOT_YET_VALID',
			message: 'This coupon is not valid yet',
		});
	}
}

export class CouponExpiredError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'COUPON_EXPIRED',
			message: 'This coupon has expired',
		});
	}
}

export class CouponUsageLimitReachedError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'COUPON_USAGE_LIMIT_REACHED',
			message: 'This coupon has reached its usage limit',
		});
	}
}

export class CouponCustomerUsageLimitReachedError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'COUPON_CUSTOMER_USAGE_LIMIT_REACHED',
			message: 'You have already used this coupon the maximum number of times',
		});
	}
}

export class CouponNotApplicableError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'COUPON_NOT_APPLICABLE',
			message: 'This coupon does not apply to any item in the cart',
		});
	}
}
