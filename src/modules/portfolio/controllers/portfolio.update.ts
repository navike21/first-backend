import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import {
	parseRequestData,
	getUploadedFileField,
	getUploadedFileArray,
} from '@Helpers/multipartRequest';
import { updatePortfolio } from '../application/updatePortfolio';
import { UpdatePortfolioSchema } from '../schemas/portfolio.schema';

export const portfolioUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdatePortfolioSchema, parseRequestData(req));

	const result = await updatePortfolio(
		id,
		validated,
		getUploadedFileField(req, 'cover'),
		res.locals.userId as string | undefined,
		getUploadedFileArray(req, 'gallery'),
	);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PORTFOLIO_UPDATE',
		message: 'SUCCESS_PORTFOLIO_UPDATE',
		ns: 'portfolio',
		data: result.data,
		warnings: result.warnings,
	});
});
