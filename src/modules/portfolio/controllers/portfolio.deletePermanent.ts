import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deletePortfolioPhysical } from '../application/deletePortfolioPhysical';

export const portfolioDeletePermanentController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deletePortfolioPhysical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_PERMANENTLY_DELETED',
		message: 'SUCCESS_PORTFOLIO_PERMANENTLY_DELETED',
		ns: 'portfolio',
		data,
	});
});
