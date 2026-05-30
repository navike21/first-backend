import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedUserGroups } from '../application/listDeletedUserGroups';

export const userGroupTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const result = await listDeletedUserGroups({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_USER_GROUP_TRASH_LIST',
		message: 'SUCCESS_USER_GROUP_TRASH_LIST',
		ns: 'user-groups',
		data: result,
	});
});
