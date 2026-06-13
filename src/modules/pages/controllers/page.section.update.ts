import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateSection } from '../application/updateSection';
import { UpdateSectionSchema } from '../schemas/page.schema';

export const pageSectionUpdateController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const sectionId = String(req.params.sectionId);
	const validated = validate(UpdateSectionSchema, req.body);

	const data = await updateSection(slug, sectionId, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_SECTION_UPDATED',
		message: 'SUCCESS_PAGE_SECTION_UPDATED',
		ns: 'pages',
		data,
	});
});
