import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createCategory } from '../application/createCategory';
import { CreateCategorySchema } from '../schemas/category.schema';

export const categoryCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateCategorySchema, req.body);

	const data = await createCategory(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_CATEGORY_CREATE',
		message: 'SUCCESS_CATEGORY_CREATE',
		ns: 'categories',
		data,
	});
});
