import { AppError } from '@Shared/domain/AppError';

export class ShippingRuleNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'SHIPPING_RULE_NOT_FOUND',
			message: 'Shipping rule not found',
		});
	}
}

export class ShippingNotAvailableError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'SHIPPING_NOT_AVAILABLE',
			message: 'No active shipping rule applies to this address',
		});
	}
}
