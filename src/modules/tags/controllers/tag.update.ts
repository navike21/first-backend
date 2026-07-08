import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateTag } from '../application/updateTag';
import { UpdateTagSchema } from '../schemas/tag.schema';

export const tagUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateTagSchema, req.body);

	const data = await updateTag(id, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TAG_UPDATE',
		message: 'SUCCESS_TAG_UPDATE',
		ns: 'tags',
		data,
	});
});
