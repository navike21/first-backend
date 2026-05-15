import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteSection } from '../application/deleteSection';

export const pageSectionDeleteController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const sectionId = String(req.params.sectionId);
	const data = await deleteSection(slug, sectionId);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_SECTION_DELETED',
		message: 'SUCCESS_PAGE_SECTION_DELETED',
		ns: 'pages',
		data,
	});
});
