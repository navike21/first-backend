import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { updatePortfolio } from '../application/updatePortfolio';
import { UpdatePortfolioSchema } from '../schemas/portfolio.schema';

export const portfolioUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const parsed = UpdatePortfolioSchema.safeParse(req.body);
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

	const data = await updatePortfolio(id, parsed.data!);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_UPDATE',
		message: 'SUCCESS_PORTFOLIO_UPDATE',
		ns: 'portfolio',
		data,
	});
});
