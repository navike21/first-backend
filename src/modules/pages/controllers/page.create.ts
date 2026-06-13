import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createPage } from '../application/createPage';
import { CreatePageSchema } from '../schemas/page.schema';

export const pageCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreatePageSchema, req.body);

	const data = await createPage(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PAGE_CREATE',
		message: 'SUCCESS_PAGE_CREATE',
		ns: 'pages',
		data,
	});
});
