import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deletePortfolioLogical } from '../application/deletePortfolioLogical';

export const portfolioDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deletePortfolioLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_DELETED',
		message: 'SUCCESS_PORTFOLIO_DELETED',
		ns: 'portfolio',
		data,
	});
});
