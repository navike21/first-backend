import { describe, it, expect } from 'vitest';
import {
	CreateClientSchema,
	UpdateClientSchema,
	ListClientsQuerySchema,
} from '@Modules/clients/schemas/client.schema';

const validClient = {
	businessName: 'Acme Corp',
	clientType: 'company',
	country: 'PE',
};

describe('client.schema', () => {
	it('CreateClientSchema parses valid minimal data', () => {
		const result = CreateClientSchema.safeParse(validClient);
		expect(result.success).toBe(true);
	});

	it('CreateClientSchema rejects missing businessName', () => {
		const result = CreateClientSchema.safeParse({
			clientType: 'company',
			country: 'PE',
		});
		expect(result.success).toBe(false);
	});

	it('CreateClientSchema rejects invalid clientType', () => {
		const result = CreateClientSchema.safeParse({
			...validClient,
			clientType: 'invalid',
		});
		expect(result.success).toBe(false);
	});

	it('CreateClientSchema rejects country longer than 2 chars', () => {
		const result = CreateClientSchema.safeParse({
			...validClient,
			country: 'PER',
		});
		expect(result.success).toBe(false);
	});

	it('CreateClientSchema uppercases country', () => {
		const result = CreateClientSchema.safeParse({
			...validClient,
			country: 'pe',
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.country).toBe('PE');
	});

	it('CreateClientSchema accepts optional fields', () => {
		const result = CreateClientSchema.safeParse({
			...validClient,
			documentType: 'DNI',
			documentNumber: '12345678',
			logoUrl: 'https://example.com/logo.png',
			website: 'https://example.com',
			notes: 'A note',
			primaryContact: {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
			},
		});
		expect(result.success).toBe(true);
	});

	it('CreateClientSchema rejects invalid document type', () => {
		const result = CreateClientSchema.safeParse({
			...validClient,
			documentType: 'INVALID_DOC',
		});
		expect(result.success).toBe(false);
	});

	it('UpdateClientSchema allows partial data', () => {
		const result = UpdateClientSchema.safeParse({ businessName: 'New Name' });
		expect(result.success).toBe(true);
	});

	it('UpdateClientSchema allows empty object', () => {
		const result = UpdateClientSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('ListClientsQuerySchema defaults page and limit', () => {
		const result = ListClientsQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});

	it('ListClientsQuerySchema coerces string to number', () => {
		const result = ListClientsQuerySchema.safeParse({ page: '2', limit: '20' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(2);
			expect(result.data.limit).toBe(20);
		}
	});
});
