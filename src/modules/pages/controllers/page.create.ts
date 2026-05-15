import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { createPage } from '../application/createPage';
import { CreatePageSchema } from '../schemas/page.schema';

export const pageCreateController = asyncHandler(async (req, res) => {
	const parsed = CreatePageSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await createPage(parsed.data);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PAGE_CREATE',
		message: 'SUCCESS_PAGE_CREATE',
		ns: 'pages',
		data,
	});
});
