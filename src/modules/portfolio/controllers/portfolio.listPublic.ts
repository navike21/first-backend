import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listPortfolioPublic } from '../application/listPortfolioPublic';
import { ListPortfolioQuerySchema } from '../schemas/portfolio.schema';

export const portfolioListPublicController = asyncHandler(async (req, res) => {
	const query = ListPortfolioQuerySchema.parse(req.query);
	const { data, meta } = await listPortfolioPublic({
		page: query.page,
		limit: query.limit,
		featured: query.featured,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_LIST',
		message: 'SUCCESS_PORTFOLIO_LIST',
		ns: 'portfolio',
		data,
		meta,
	});
});
