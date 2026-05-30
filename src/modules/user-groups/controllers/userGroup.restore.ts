import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreUserGroup } from '../application/restoreUserGroup';

export const userGroupRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreUserGroup(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_USER_GROUP_RESTORED',
		message: 'SUCCESS_USER_GROUP_RESTORED',
		ns: 'user-groups',
		data,
	});
});
