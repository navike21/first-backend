import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import {
	parseRequestData,
	getUploadedFileField,
} from '@Helpers/multipartRequest';
import { createPage } from '../application/createPage';
import { CreatePageSchema } from '../schemas/page.schema';

export const pageCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreatePageSchema, parseRequestData(req));

	const result = await createPage(
		validated,
		{
			cover: getUploadedFileField(req, 'cover'),
			ogImage: getUploadedFileField(req, 'ogImage'),
		},
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PAGE_CREATE',
		message: 'SUCCESS_PAGE_CREATE',
		ns: 'pages',
		data: result.data,
		warnings: result.warnings,
	});
});
