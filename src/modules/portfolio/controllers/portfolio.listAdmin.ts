import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listPortfolioAdmin } from '../application/listPortfolioAdmin';
import { ListPortfolioAdminQuerySchema } from '../schemas/portfolio.schema';

export const portfolioListAdminController = asyncHandler(async (req, res) => {
	const query = ListPortfolioAdminQuerySchema.parse(req.query);
	const { data, meta } = await listPortfolioAdmin({
		page: query.page,
		limit: query.limit,
		status: query.status,
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
