import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import { createPortfolio } from '../application/createPortfolio';
import { CreatePortfolioSchema } from '../schemas/portfolio.schema';

export const portfolioCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreatePortfolioSchema, parseRequestData(req));

	const result = await createPortfolio(
		validated,
		getUploadedFile(req),
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PORTFOLIO_CREATE',
		message: 'SUCCESS_PORTFOLIO_CREATE',
		ns: 'portfolio',
		data: result.data,
		warnings: result.warnings,
	});
});
