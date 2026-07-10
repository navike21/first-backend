import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { replaceSections } from '../application/replaceSections';
import { ReplaceSectionsSchema } from '../schemas/page.schema';

export const pageSectionsReplaceController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(ReplaceSectionsSchema, req.body);

	const data = await replaceSections(id, validated, res.locals.userId as string | undefined);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_SECTIONS_REPLACED',
		message: 'SUCCESS_PAGE_SECTIONS_REPLACED',
		ns: 'pages',
		data,
	});
});
