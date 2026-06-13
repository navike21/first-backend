import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { AppError } from '@Shared/domain/AppError';
import { validate, validateArray } from '@Helpers/validate';

const schema = z.object({ name: z.string().min(2) });

describe('validate', () => {
	it('returns the parsed data when valid', () => {
		expect(validate(schema, { name: 'Al' })).toEqual({ name: 'Al' });
	});

	it('throws 422 VALIDATION_SCHEMA_ERROR with details when invalid', () => {
		try {
			validate(schema, { name: 'A' });
			throw new Error('should have thrown');
		} catch (err) {
			expect(err).toBeInstanceOf(AppError);
			expect((err as AppError).statusCode).toBe(422);
			expect((err as AppError).code).toBe('VALIDATION_SCHEMA_ERROR');
		}
	});
});

describe('validateArray', () => {
	it('returns the parsed array when valid', () => {
		expect(validateArray(schema, [{ name: 'Al' }])).toEqual([{ name: 'Al' }]);
	});

	it('throws when the body is not an array', () => {
		expect(() => validateArray(schema, { name: 'Al' })).toThrow();
	});

	it('throws VALIDATION_SCHEMA_ARRAY_ERROR on an invalid item', () => {
		try {
			validateArray(schema, [{ name: 'A' }]);
			throw new Error('should have thrown');
		} catch (err) {
			expect((err as AppError).code).toBe('VALIDATION_SCHEMA_ARRAY_ERROR');
		}
	});
});
