import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { UpdateUserGroupSchema } from '../schemas/userGroup.schema';
import { updateUserGroup } from '../application/updateUserGroup';

export const updateUserGroupController = asyncHandler(async (req, res) => {
	const validated = validate(UpdateUserGroupSchema, req.body);

	const group = await updateUserGroup(String(req.params.id), validated);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUP_UPDATED',
		message: 'USER_GROUP_UPDATED',
		ns: 'user-groups',
		data: group,
	});
});
