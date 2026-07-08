import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { reorderSections } from '../application/reorderSections';
import { ReorderSectionsSchema } from '../schemas/page.schema';

export const pageSectionReorderController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(ReorderSectionsSchema, req.body);

	const data = await reorderSections(id, validated.order);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_SECTIONS_REORDERED',
		message: 'SUCCESS_PAGE_SECTIONS_REORDERED',
		ns: 'pages',
		data,
	});
});
