import { describe, it, expect } from 'vitest';
import {
	PortfolioNotFoundError,
	PortfolioSlugConflictError,
} from '@Modules/portfolio/domain/errors/PortfolioErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Portfolio domain errors', () => {
	it('PortfolioNotFoundError has correct code and status', () => {
		const error = new PortfolioNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PORTFOLIO_NOT_FOUND');
	});

	it('PortfolioSlugConflictError has correct code and status', () => {
		const error = new PortfolioSlugConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('PORTFOLIO_SLUG_CONFLICT');
	});
});
