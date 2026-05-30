import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restorePage } from '../application/restorePage';

export const pageRestoreController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const data = await restorePage(slug);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_RESTORED',
		message: 'SUCCESS_PAGE_RESTORED',
		ns: 'pages',
		data,
	});
});
