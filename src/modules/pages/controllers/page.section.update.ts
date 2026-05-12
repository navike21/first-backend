import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { updateSection } from '../application/updateSection';
import { UpdateSectionSchema } from '../schemas/page.schema';

export const pageSectionUpdateController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const sectionId = String(req.params.sectionId);
	const parsed = UpdateSectionSchema.safeParse(req.body);
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

	const data = await updateSection(slug, sectionId, parsed.data!);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_SECTION_UPDATED',
		message: 'SUCCESS_PAGE_SECTION_UPDATED',
		ns: 'pages',
		data,
	});
});
