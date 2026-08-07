import { describe, it, expect } from 'vitest';
import {
	PaymentProviderUnknownError,
	PaymentMethodNotFoundError,
} from '@Modules/payments/domain/errors/PaymentErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Payment domain errors', () => {
	it('PaymentProviderUnknownError has correct code and status', () => {
		const error = new PaymentProviderUnknownError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PAYMENT_PROVIDER_UNKNOWN');
	});

	it('PaymentMethodNotFoundError has correct code and status', () => {
		const error = new PaymentMethodNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PAYMENT_METHOD_NOT_FOUND');
	});
});
