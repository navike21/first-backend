import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restorePage } from '../application/restorePage';

export const pageRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restorePage(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_RESTORED',
		message: 'SUCCESS_PAGE_RESTORED',
		ns: 'pages',
		data,
	});
});
