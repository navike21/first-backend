import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedPages } from '../application/listDeletedPages';

export const pageTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedPages({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_TRASH_LIST',
		message: 'SUCCESS_PAGE_TRASH_LIST',
		ns: 'pages',
		data,
		meta,
	});
});
