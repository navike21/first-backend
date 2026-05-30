import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restorePortfolio } from '../application/restorePortfolio';

export const portfolioRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restorePortfolio(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_RESTORED',
		message: 'SUCCESS_PORTFOLIO_RESTORED',
		ns: 'portfolio',
		data,
	});
});
