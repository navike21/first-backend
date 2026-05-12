import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listPortfolioByService } from '../application/listPortfolioByService';
import { ListPortfolioQuerySchema } from '../schemas/portfolio.schema';

export const portfolioListByServiceController = asyncHandler(async (req, res) => {
	const serviceSlug = String(req.params.serviceSlug);
	const query = ListPortfolioQuerySchema.parse(req.query);
	const { data, meta } = await listPortfolioByService({
		serviceSlug,
		page: query.page,
		limit: query.limit,
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
