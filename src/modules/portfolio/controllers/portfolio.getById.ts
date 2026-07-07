import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getPortfolioById } from '../application/getPortfolioById';

export const portfolioGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getPortfolioById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_FOUND',
		message: 'SUCCESS_PORTFOLIO_FOUND',
		ns: 'portfolio',
		data,
	});
});
