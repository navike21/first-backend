import { describe, it, expect } from 'vitest';
import {
	ShippingRuleNotFoundError,
	ShippingNotAvailableError,
} from '@Modules/shipping/domain/errors/ShippingErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Shipping domain errors', () => {
	it('ShippingRuleNotFoundError has correct code and status', () => {
		const error = new ShippingRuleNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('SHIPPING_RULE_NOT_FOUND');
	});

	it('ShippingNotAvailableError has correct code and status', () => {
		const error = new ShippingNotAvailableError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('SHIPPING_NOT_AVAILABLE');
	});
});
