import { describe, it, expect } from 'vitest';
import {
	RegisterCustomerSchema,
	CustomerLoginSchema,
	ForgotCustomerPasswordSchema,
	ResetCustomerPasswordSchema,
} from '@Modules/customer-auth/schemas/customerAuth.schema';

describe('customerAuth.schema', () => {
	it('RegisterCustomerSchema parses valid data', () => {
		const result = RegisterCustomerSchema.safeParse({
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'Jane@Example.com',
			password: 'NewPass1',
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.email).toBe('jane@example.com');
	});

	it('RegisterCustomerSchema rejects a weak password', () => {
		const result = RegisterCustomerSchema.safeParse({
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
			password: 'weak',
		});
		expect(result.success).toBe(false);
	});

	it('RegisterCustomerSchema rejects missing firstName', () => {
		const result = RegisterCustomerSchema.safeParse({
			lastName: 'Doe',
			email: 'jane@example.com',
			password: 'NewPass1',
		});
		expect(result.success).toBe(false);
	});

	it('CustomerLoginSchema parses valid data', () => {
		const result = CustomerLoginSchema.safeParse({
			email: 'a@b.com',
			password: 'pass',
		});
		expect(result.success).toBe(true);
	});

	it('CustomerLoginSchema rejects invalid email', () => {
		const result = CustomerLoginSchema.safeParse({
			email: 'not-email',
			password: 'pass',
		});
		expect(result.success).toBe(false);
	});

	it('ForgotCustomerPasswordSchema parses valid email', () => {
		const result = ForgotCustomerPasswordSchema.safeParse({
			email: 'a@b.com',
		});
		expect(result.success).toBe(true);
	});

	it('ResetCustomerPasswordSchema rejects weak password', () => {
		const result = ResetCustomerPasswordSchema.safeParse({
			password: 'weak',
		});
		expect(result.success).toBe(false);
	});
});
