import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { addSection } from '../application/addSection';
import { CreateSectionSchema } from '../schemas/page.schema';

export const pageSectionAddController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const validated = validate(CreateSectionSchema, req.body);

	const data = await addSection(slug, validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PAGE_SECTION_ADDED',
		message: 'SUCCESS_PAGE_SECTION_ADDED',
		ns: 'pages',
		data,
	});
});
