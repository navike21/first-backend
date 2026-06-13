import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { ListUserGroupsQuerySchema } from '../schemas/userGroup.schema';
import { listUserGroups } from '../application/listUserGroups';

export const listUserGroupsController = asyncHandler(async (req, res) => {
	const validated = validate(ListUserGroupsQuerySchema, req.query);

	const result = await listUserGroups(validated);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUPS_LISTED',
		message: 'USER_GROUPS_LISTED',
		ns: 'user-groups',
		data: result,
	});
});
