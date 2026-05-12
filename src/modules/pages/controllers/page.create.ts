import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { createPage } from '../application/createPage';
import { CreatePageSchema } from '../schemas/page.schema';

export const pageCreateController = asyncHandler(async (req, res) => {
	const parsed = CreatePageSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
		});
	}

	const data = await createPage(parsed.data!);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PAGE_CREATE',
		message: 'SUCCESS_PAGE_CREATE',
		ns: 'pages',
		data,
	});
});
