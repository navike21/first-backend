import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { AddGroupMembersSchema } from '../schemas/userGroup.schema';
import { addGroupMembers } from '../application/addGroupMembers';

export const addGroupMembersController = asyncHandler(async (req, res) => {
	const { userIds } = validate(AddGroupMembersSchema, req.body);

	const result = await addGroupMembers(String(req.params.id), userIds);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUP_MEMBERS_ADDED',
		message: 'USER_GROUP_MEMBERS_ADDED',
		ns: 'user-groups',
		data: result,
	});
});
