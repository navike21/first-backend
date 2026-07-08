import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { purgeTag } from '../application/purgeTag';

export const tagPurgeController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await purgeTag(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TAG_PURGED',
		message: 'SUCCESS_TAG_PURGED',
		ns: 'tags',
		data,
	});
});
