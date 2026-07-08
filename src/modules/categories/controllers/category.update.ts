import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateCategory } from '../application/updateCategory';
import { UpdateCategorySchema } from '../schemas/category.schema';

export const categoryUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateCategorySchema, req.body);

	const data = await updateCategory(id, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CATEGORY_UPDATE',
		message: 'SUCCESS_CATEGORY_UPDATE',
		ns: 'categories',
		data,
	});
});
