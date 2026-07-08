import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { resolvePageByPath } from '../application/resolvePageByPath';
import { ResolvePageQuerySchema } from '../schemas/page.schema';

export const pageResolvePublicController = asyncHandler(async (req, res) => {
	const query = validate(ResolvePageQuerySchema, req.query);
	const data = await resolvePageByPath(query.path, query.lang);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_FOUND',
		message: 'SUCCESS_PAGE_FOUND',
		ns: 'pages',
		data,
	});
});
