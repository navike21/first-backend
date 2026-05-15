import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listPages } from '../application/listPages';
import { ListPagesQuerySchema } from '../schemas/page.schema';

export const pageListPublicController = asyncHandler(async (req, res) => {
	const query = ListPagesQuerySchema.parse(req.query);
	const { data, meta } = await listPages({
		page: query.page,
		limit: query.limit,
		adminView: false,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_LIST',
		message: 'SUCCESS_PAGE_LIST',
		ns: 'pages',
		data,
		meta,
	});
});

export const pageListAdminController = asyncHandler(async (req, res) => {
	const query = ListPagesQuerySchema.parse(req.query);
	const { data, meta } = await listPages({
		page: query.page,
		limit: query.limit,
		adminView: true,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_LIST',
		message: 'SUCCESS_PAGE_LIST',
		ns: 'pages',
		data,
		meta,
	});
});
