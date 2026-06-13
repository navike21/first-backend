import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { CreateUserGroupSchema } from '../schemas/userGroup.schema';
import { createUserGroup } from '../application/createUserGroup';

export const createUserGroupController = asyncHandler(async (req, res) => {
	const validated = validate(CreateUserGroupSchema, req.body);

	const group = await createUserGroup(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'USER_GROUP_CREATED',
		message: 'USER_GROUP_CREATED',
		ns: 'user-groups',
		data: group,
	});
});
