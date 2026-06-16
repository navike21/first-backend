import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { ListGroupMembersQuerySchema } from '../schemas/userGroup.schema';
import { listGroupMembers } from '../application/listGroupMembers';

export const listGroupMembersController = asyncHandler(async (req, res) => {
	const validated = validate(ListGroupMembersQuerySchema, req.query);

	const result = await listGroupMembers(String(req.params.id), validated);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUP_MEMBERS_LISTED',
		message: 'USER_GROUP_MEMBERS_LISTED',
		ns: 'user-groups',
		data: result,
	});
});
