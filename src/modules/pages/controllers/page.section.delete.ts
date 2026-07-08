import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteSection } from '../application/deleteSection';

export const pageSectionDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const sectionId = String(req.params.sectionId);
	const data = await deleteSection(id, sectionId);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_SECTION_DELETED',
		message: 'SUCCESS_PAGE_SECTION_DELETED',
		ns: 'pages',
		data,
	});
});
