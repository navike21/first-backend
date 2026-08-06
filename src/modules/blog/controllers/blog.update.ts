import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import {
	parseRequestData,
	getUploadedFileField,
} from '@Helpers/multipartRequest';
import { updateBlogPost } from '../application/updateBlogPost';
import { UpdateBlogSchema } from '../schemas/blog.schema';

export const blogUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateBlogSchema, parseRequestData(req));

	const result = await updateBlogPost(
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
		code: 'SUCCESS_BLOG_UPDATE',
		message: 'SUCCESS_BLOG_UPDATE',
		ns: 'blog',
		data: result.data,
		warnings: result.warnings,
	});
});
