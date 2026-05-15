import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getPortfolioBySlug } from '../application/getPortfolioBySlug';

export const portfolioGetBySlugController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const data = await getPortfolioBySlug(slug);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_FOUND',
		message: 'SUCCESS_PORTFOLIO_FOUND',
		ns: 'portfolio',
		data,
	});
});
