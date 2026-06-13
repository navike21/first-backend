import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@Shared/domain/AppError';

vi.mock('@Config/i18n', () => ({
	default: {
		t: vi.fn(
			(_key: string, opts?: { defaultValue?: string }) =>
				opts?.defaultValue ?? _key,
		),
	},
}));

vi.mock('@Helpers/log', () => ({
	logError: vi.fn(),
}));

vi.mock('@Helpers/responseStructure', () => ({
	errorResponse: vi.fn(),
}));

vi.mock('@Modules/audit-log/application/createAuditEntry', () => ({
	createAuditEntry: vi.fn().mockResolvedValue(undefined),
}));

import { errorMiddleware } from '@Middlewares/errorMiddleware';
import { errorResponse } from '@Helpers/responseStructure';
import { logError } from '@Helpers/log';
import { createAuditEntry } from '@Modules/audit-log/application/createAuditEntry';

const makeRes = (lang?: string): Response => {
	const res = { locals: { lang } } as unknown as Response;
	return res;
};

const req = {} as Request;
const next = vi.fn() as unknown as NextFunction;

describe('errorMiddleware', () => {
	it('calls errorResponse with the AppError fields when an AppError is thrown', () => {
		// Arrange
		const error = new AppError({
			statusCode: 404,
			code: 'NOT_FOUND',
			message: 'Not found',
		});
		const res = makeRes('en');

		// Act
		errorMiddleware(error, req, res, next);

		// Assert
		expect(errorResponse).toHaveBeenCalledWith(
			res,
			expect.objectContaining({ statusCode: 404, code: 'NOT_FOUND' }),
		);
	});

	it('calls errorResponse with 500 for a generic Error', () => {
		// Arrange
		const error = new Error('unexpected');
		const res = makeRes('en');

		// Act
		errorMiddleware(error, req, res, next);

		// Assert
		expect(errorResponse).toHaveBeenCalledWith(
			res,
			expect.objectContaining({
				statusCode: 500,
				code: 'INTERNAL_SERVER_ERROR',
			}),
		);
		expect(logError).toHaveBeenCalled();
	});

	it('calls errorResponse with 500 for a string error', () => {
		// Arrange
		const res = makeRes('en');

		// Act
		errorMiddleware('some string error', req, res, next);

		// Assert
		expect(errorResponse).toHaveBeenCalledWith(
			res,
			expect.objectContaining({ statusCode: 500 }),
		);
		expect(logError).toHaveBeenCalled();
	});

	it('defaults lang to en when res.locals.lang is undefined', () => {
		// Arrange
		const error = new AppError({
			statusCode: 400,
			code: 'BAD',
			message: 'bad',
		});
		const res = { locals: {} } as unknown as Response;

		// Act
		errorMiddleware(error, req, res, next);

		// Assert
		expect(errorResponse).toHaveBeenCalled();
	});

	it('defaults lang to en when res.locals.lang is null', () => {
		// Arrange
		const error = new AppError({
			statusCode: 400,
			code: 'BAD',
			message: 'bad',
		});
		const res = { locals: { lang: null } } as unknown as Response;

		// Act
		errorMiddleware(error, req, res, next);

		// Assert
		expect(errorResponse).toHaveBeenCalled();
	});

	it('uses lang from res.locals when present', () => {
		// Arrange
		const error = new AppError({
			statusCode: 403,
			code: 'FORBIDDEN',
			message: 'forbidden',
		});
		const res = makeRes('es');

		// Act
		errorMiddleware(error, req, res, next);

		// Assert
		expect(errorResponse).toHaveBeenCalledWith(
			res,
			expect.objectContaining({ statusCode: 403 }),
		);
	});

	it('maps a MongoDB duplicate-key error (E11000) to 409 RESOURCE_DUPLICATE', () => {
		// Arrange
		const error = {
			name: 'MongoServerError',
			code: 11000,
			keyValue: { email: 'taken@example.com' },
		};
		const res = makeRes('en');

		// Act
		errorMiddleware(error, req, res, next);

		// Assert: maps to 409 and only leaks the offending key names, not values
		expect(errorResponse).toHaveBeenCalledWith(
			res,
			expect.objectContaining({
				statusCode: 409,
				code: 'RESOURCE_DUPLICATE',
				details: { keys: ['email'] },
			}),
		);
	});

	it('does not include details when the duplicate error has no keyValue', () => {
		// Arrange
		const error = { name: 'MongoServerError', code: 11000 };
		const res = makeRes('en');

		// Act
		errorMiddleware(error, req, res, next);

		// Assert
		expect(errorResponse).toHaveBeenCalledWith(
			res,
			expect.objectContaining({
				statusCode: 409,
				code: 'RESOURCE_DUPLICATE',
				details: undefined,
			}),
		);
	});

	it('audits an access:denied entry on a 403 error', () => {
		const error = new AppError({
			statusCode: 403,
			code: 'FORBIDDEN',
			message: 'forbidden',
		});
		const res = { locals: { lang: 'en', userId: 'u1' } } as unknown as Response;
		const auditReq = {
			method: 'DELETE',
			originalUrl: '/api/v1/users/x/permanent',
			headers: {},
			socket: { remoteAddress: '1.2.3.4' },
		} as unknown as Request;

		errorMiddleware(error, auditReq, res, next);

		expect(createAuditEntry).toHaveBeenCalledWith(
			expect.objectContaining({
				userId: 'u1',
				action: 'access:denied',
				metadata: expect.objectContaining({
					code: 'FORBIDDEN',
					method: 'DELETE',
				}),
			}),
		);
	});

	it('does NOT audit on non-403 AppErrors', () => {
		const error = new AppError({
			statusCode: 404,
			code: 'NOT_FOUND',
			message: 'nope',
		});
		errorMiddleware(error, req, makeRes('en'), next);
		expect(createAuditEntry).not.toHaveBeenCalled();
	});
});
