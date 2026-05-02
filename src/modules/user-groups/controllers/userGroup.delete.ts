import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteUserGroup } from '../application/deleteUserGroup';

export const deleteUserGroupController = asyncHandler(async (req, res) => {
	await deleteUserGroup(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUP_DELETED',
		message: 'USER_GROUP_DELETED',
		ns: 'user-groups',
		data: null,
	});
});
