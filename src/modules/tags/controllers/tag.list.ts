import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listTags } from '../application/listTags';
import { ListTagsQuerySchema } from '../schemas/tag.schema';

export const tagListPublicController = asyncHandler(async (req, res) => {
	const query = ListTagsQuerySchema.parse(req.query);
	const { data, meta } = await listTags({
		page: query.page,
		limit: query.limit,
		adminView: false,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TAG_LIST',
		message: 'SUCCESS_TAG_LIST',
		ns: 'tags',
		data,
		meta,
	});
});

export const tagListAdminController = asyncHandler(async (req, res) => {
	const query = ListTagsQuerySchema.parse(req.query);
	const { data, meta } = await listTags({
		page: query.page,
		limit: query.limit,
		adminView: true,
		search: query.search,
		isActive: query.isActive,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TAG_LIST',
		message: 'SUCCESS_TAG_LIST',
		ns: 'tags',
		data,
		meta,
	});
});
