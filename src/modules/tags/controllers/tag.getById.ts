import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getTagById } from '../application/getTagById';

export const tagGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getTagById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TAG_FOUND',
		message: 'SUCCESS_TAG_FOUND',
		ns: 'tags',
		data,
	});
});
