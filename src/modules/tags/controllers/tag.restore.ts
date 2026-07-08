import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreTag } from '../application/restoreTag';

export const tagRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreTag(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TAG_RESTORED',
		message: 'SUCCESS_TAG_RESTORED',
		ns: 'tags',
		data,
	});
});
