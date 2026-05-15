import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { createPortfolio } from '../application/createPortfolio';
import { CreatePortfolioSchema } from '../schemas/portfolio.schema';

export const portfolioCreateController = asyncHandler(async (req, res) => {
	const parsed = CreatePortfolioSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await createPortfolio(parsed.data);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PORTFOLIO_CREATE',
		message: 'SUCCESS_PORTFOLIO_CREATE',
		ns: 'portfolio',
		data,
	});
});
