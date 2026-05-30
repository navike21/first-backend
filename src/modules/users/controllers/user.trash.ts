import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedUsers } from '../application/listDeletedUsers';

export const userTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const result = await listDeletedUsers({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_USER_TRASH_LIST',
		message: 'SUCCESS_USER_TRASH_LIST',
		ns: 'users',
		data: result,
	});
});
