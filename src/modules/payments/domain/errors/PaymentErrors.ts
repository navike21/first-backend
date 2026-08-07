import { AppError } from '@Shared/domain/AppError';

export class PaymentProviderUnknownError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PAYMENT_PROVIDER_UNKNOWN',
			message: 'Unknown payment provider',
		});
	}
}

export class PaymentMethodNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PAYMENT_METHOD_NOT_FOUND',
			message: 'Payment method not found',
		});
	}
}
