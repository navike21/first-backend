import { describe, it, expect } from 'vitest';
import type { Request } from 'express';
import { metaInformation, paramsInformation } from '@Helpers/metaInformation';

describe('metaInformation', () => {
	it('calculates totalPages and returns pagination meta', () => {
		// Arrange
		const input = { page: 2, limit: 10, total: 35 };

		// Act
		const result = metaInformation(input);

		// Assert
		expect(result).toEqual({ page: 2, limit: 10, total: 35, totalPages: 4 });
	});

	it('uses defaults when page, limit, and total are omitted', () => {
		// Arrange & Act
		const result = metaInformation({});

		// Assert
		expect(result).toEqual({ page: 1, limit: 10, total: 0, totalPages: 0 });
	});
});

describe('paramsInformation', () => {
	it('extracts and converts pagination query parameters from the request', () => {
		// Arrange
		const mockRequest = {
			query: { limit: '20', page: '3', status: 'active' },
		} as unknown as Request;

		// Act
		const result = paramsInformation(mockRequest);

		// Assert
		expect(result.limitNumber).toBe(20);
		expect(result.pageNumber).toBe(3);
		expect(result.statusParam).toBe('active');
		expect(result.skip).toBe(40);
	});

	it('returns undefined statusParam when status is absent', () => {
		// Arrange
		const mockRequest = {
			query: { limit: '5', page: '1' },
		} as unknown as Request;

		// Act
		const result = paramsInformation(mockRequest);

		// Assert
		expect(result.statusParam).toBeUndefined();
		expect(result.skip).toBe(0);
	});
});
