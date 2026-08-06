import { describe, it, expect } from 'vitest';
import {
	CreateCustomerSchema,
	UpdateCustomerSchema,
	ListCustomersQuerySchema,
} from '@Modules/customers/schemas/customer.schema';

const validCustomer = {
	firstName: 'Jane',
	lastName: 'Doe',
	email: 'jane@example.com',
};

describe('customer.schema', () => {
	it('CreateCustomerSchema parses valid minimal data', () => {
		const result = CreateCustomerSchema.safeParse(validCustomer);
		expect(result.success).toBe(true);
	});

	it('CreateCustomerSchema rejects missing firstName', () => {
		const result = CreateCustomerSchema.safeParse({
			lastName: 'Doe',
			email: 'jane@example.com',
		});
		expect(result.success).toBe(false);
	});

	it('CreateCustomerSchema rejects an invalid email', () => {
		const result = CreateCustomerSchema.safeParse({
			...validCustomer,
			email: 'not-an-email',
		});
		expect(result.success).toBe(false);
	});

	it('CreateCustomerSchema lowercases the email', () => {
		const result = CreateCustomerSchema.safeParse({
			...validCustomer,
			email: 'Jane@Example.COM',
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.email).toBe('jane@example.com');
	});

	it('CreateCustomerSchema defaults addresses to an empty array', () => {
		const result = CreateCustomerSchema.safeParse(validCustomer);
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.addresses).toEqual([]);
	});

	it('CreateCustomerSchema accepts a valid address', () => {
		const result = CreateCustomerSchema.safeParse({
			...validCustomer,
			addresses: [
				{ type: 'shipping', country: 'PE', region: 'Lima', isDefault: true },
			],
		});
		expect(result.success).toBe(true);
	});

	it('CreateCustomerSchema rejects an address with an invalid type', () => {
		const result = CreateCustomerSchema.safeParse({
			...validCustomer,
			addresses: [{ type: 'work', country: 'PE' }],
		});
		expect(result.success).toBe(false);
	});

	it('CreateCustomerSchema rejects an invalid document type', () => {
		const result = CreateCustomerSchema.safeParse({
			...validCustomer,
			documentType: 'INVALID_DOC',
		});
		expect(result.success).toBe(false);
	});

	it('UpdateCustomerSchema allows partial data', () => {
		const result = UpdateCustomerSchema.safeParse({ firstName: 'New Name' });
		expect(result.success).toBe(true);
	});

	it('UpdateCustomerSchema allows empty object', () => {
		const result = UpdateCustomerSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('ListCustomersQuerySchema defaults page and limit', () => {
		const result = ListCustomersQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});

	it('ListCustomersQuerySchema coerces string to number', () => {
		const result = ListCustomersQuerySchema.safeParse({
			page: '2',
			limit: '20',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(2);
			expect(result.data.limit).toBe(20);
		}
	});
});
