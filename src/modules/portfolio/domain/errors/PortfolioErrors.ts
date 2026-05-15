import { AppError } from '@Shared/domain/AppError';

export class PortfolioNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PORTFOLIO_NOT_FOUND',
			message: 'Portfolio item not found',
		});
	}
}

export class PortfolioSlugConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'PORTFOLIO_SLUG_CONFLICT',
			message: 'A portfolio item with this slug already exists',
		});
	}
}
