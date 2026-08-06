import { asyncHandler } from '@Middlewares/asyncHandler';
import { validate } from '@Helpers/validate';
import {
	parseRequestData,
	getUploadedFileField,
} from '@Helpers/multipartRequest';
import { updateBlogPost } from '../application/updateBlogPost';
import { UpdateBlogSchema } from '../schemas/blog.schema';
import { respondBlog } from './blogResponse';

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
	respondBlog(res, 200, 'SUCCESS_BLOG_UPDATE', result.data, {
		warnings: result.warnings,
	});
});
