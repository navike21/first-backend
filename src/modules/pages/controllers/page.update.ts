import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updatePage } from '../application/updatePage';
import { UpdatePageSchema } from '../schemas/page.schema';

export const pageUpdateController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const validated = validate(UpdatePageSchema, req.body);

	const data = await updatePage(slug, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_UPDATE',
		message: 'SUCCESS_PAGE_UPDATE',
		ns: 'pages',
		data,
	});
});
