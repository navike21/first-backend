import { describe, it, expect } from 'vitest';
import { AddressSchema } from '@Shared/schemas/address.schema';

describe('AddressSchema', () => {
	it('accepts an empty object (all fields optional)', () => {
		const result = AddressSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('uppercases and trims the country code', () => {
		const result = AddressSchema.safeParse({ country: ' pe ' });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.country).toBe('PE');
	});

	it('rejects a country code that is not 2 characters', () => {
		const result = AddressSchema.safeParse({ country: 'PER' });
		expect(result.success).toBe(false);
	});

	it('accepts a fully populated address', () => {
		const result = AddressSchema.safeParse({
			country: 'PE',
			ubigeoCode: '150101',
			region: 'Lima',
			province: 'Lima',
			district: 'Miraflores',
			address: 'Av. Larco 123',
			addressNumber: '123',
			addressInterior: 'Piso 4',
		});
		expect(result.success).toBe(true);
	});
});
