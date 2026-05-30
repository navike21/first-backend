import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedPortfolio } from '../application/listDeletedPortfolio';

export const portfolioTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const result = await listDeletedPortfolio({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_TRASH_LIST',
		message: 'SUCCESS_PORTFOLIO_TRASH_LIST',
		ns: 'portfolio',
		data: result,
	});
});
