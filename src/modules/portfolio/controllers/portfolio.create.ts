import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { createPortfolio } from '../application/createPortfolio';
import { CreatePortfolioSchema } from '../schemas/portfolio.schema';

export const portfolioCreateController = asyncHandler(async (req, res) => {
	const parsed = CreatePortfolioSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
		});
	}

	const data = await createPortfolio(parsed.data!);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PORTFOLIO_CREATE',
		message: 'SUCCESS_PORTFOLIO_CREATE',
		ns: 'portfolio',
		data,
	});
});
