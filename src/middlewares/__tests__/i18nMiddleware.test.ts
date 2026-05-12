import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { i18nMiddleware } from '@Middlewares/i18nMiddleware';

const makeReqRes = (
	acceptLanguage?: string,
): { req: Request; res: Response; next: NextFunction } => {
	const req = {
		headers: acceptLanguage ? { 'accept-language': acceptLanguage } : {},
	} as unknown as Request;
	const res = { locals: {} } as unknown as Response;
	const next = vi.fn() as unknown as NextFunction;
	return { req, res, next };
};

describe('i18nMiddleware', () => {
	it('sets lang to a supported language from the accept-language header', () => {
		// Arrange
		const { req, res, next } = makeReqRes('es-ES,es;q=0.9');

		// Act
		i18nMiddleware(req, res, next);

		// Assert
		expect(res.locals.lang).toBe('es');
		expect(next).toHaveBeenCalled();
	});

	it('falls back to en when the accept-language header is absent', () => {
		// Arrange
		const { req, res, next } = makeReqRes();

		// Act
		i18nMiddleware(req, res, next);

		// Assert
		expect(res.locals.lang).toBe('en');
	});

	it('falls back to en when the language is not supported', () => {
		// Arrange
		const { req, res, next } = makeReqRes('xx-XX');

		// Act
		i18nMiddleware(req, res, next);

		// Assert
		expect(res.locals.lang).toBe('en');
	});

	it('normalises language codes to lowercase', () => {
		// Arrange
		const { req, res, next } = makeReqRes('DE');

		// Act
		i18nMiddleware(req, res, next);

		// Assert
		expect(res.locals.lang).toBe('de');
	});
});
