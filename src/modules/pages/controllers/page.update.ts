import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { updatePage } from '../application/updatePage';
import { UpdatePageSchema } from '../schemas/page.schema';

export const pageUpdateController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const parsed = UpdatePageSchema.safeParse(req.body);
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

	const data = await updatePage(slug, parsed.data!);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_UPDATE',
		message: 'SUCCESS_PAGE_UPDATE',
		ns: 'pages',
		data,
	});
});
