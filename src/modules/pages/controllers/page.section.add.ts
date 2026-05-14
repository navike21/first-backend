import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { addSection } from '../application/addSection';
import { CreateSectionSchema } from '../schemas/page.schema';

export const pageSectionAddController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const parsed = CreateSectionSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await addSection(slug, parsed.data);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PAGE_SECTION_ADDED',
		message: 'SUCCESS_PAGE_SECTION_ADDED',
		ns: 'pages',
		data,
	});
});
