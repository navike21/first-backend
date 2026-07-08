import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteTag } from '../application/deleteTag';

export const tagDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteTag(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TAG_DELETED',
		message: 'SUCCESS_TAG_DELETED',
		ns: 'tags',
		data,
	});
});
