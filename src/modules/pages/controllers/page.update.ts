import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFileField } from '@Helpers/multipartRequest';
import { updatePage } from '../application/updatePage';
import { UpdatePageSchema } from '../schemas/page.schema';

export const pageUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdatePageSchema, parseRequestData(req));

	const result = await updatePage(
		id,
		validated,
		{
			cover: getUploadedFileField(req, 'cover'),
			ogImage: getUploadedFileField(req, 'ogImage'),
		},
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_UPDATE',
		message: 'SUCCESS_PAGE_UPDATE',
		ns: 'pages',
		data: result.data,
		warnings: result.warnings,
	});
});
