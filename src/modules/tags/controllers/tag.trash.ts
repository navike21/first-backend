import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedTags } from '../application/listDeletedTags';

export const tagTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const result = await listDeletedTags({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TAG_TRASH_LIST',
		message: 'SUCCESS_TAG_TRASH_LIST',
		ns: 'tags',
		data: result,
	});
});
