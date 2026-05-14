import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { updatePortfolio } from '../application/updatePortfolio';
import { UpdatePortfolioSchema } from '../schemas/portfolio.schema';

export const portfolioUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const parsed = UpdatePortfolioSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await updatePortfolio(id, parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_UPDATE',
		message: 'SUCCESS_PORTFOLIO_UPDATE',
		ns: 'portfolio',
		data,
	});
});
