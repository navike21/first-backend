import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@Middlewares/asyncHandler';

describe('asyncHandler', () => {
	it('calls the wrapped function with req, res, and next', async () => {
		// Arrange
		const fn = vi.fn().mockResolvedValue(undefined);
		const req = {} as Request;
		const res = {} as Response;
		const next = vi.fn() as NextFunction;

		// Act
		await asyncHandler(fn)(req, res, next);

		// Assert
		expect(fn).toHaveBeenCalledWith(req, res, next);
	});

	it('calls next with the error when the wrapped function rejects', async () => {
		// Arrange
		const error = new Error('async failure');
		const fn = vi.fn().mockRejectedValue(error);
		const req = {} as Request;
		const res = {} as Response;
		const next = vi.fn() as NextFunction;

		// Act
		await asyncHandler(fn)(req, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(error);
	});

	it('does not call next when the function resolves successfully', async () => {
		// Arrange
		const fn = vi.fn().mockResolvedValue(undefined);
		const req = {} as Request;
		const res = {} as Response;
		const next = vi.fn() as NextFunction;

		// Act
		await asyncHandler(fn)(req, res, next);

		// Assert
		expect(next).not.toHaveBeenCalled();
	});
});
