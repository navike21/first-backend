import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createTag } from '../application/createTag';
import { CreateTagSchema } from '../schemas/tag.schema';

export const tagCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateTagSchema, req.body);

	const data = await createTag(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_TAG_CREATE',
		message: 'SUCCESS_TAG_CREATE',
		ns: 'tags',
		data,
	});
});
