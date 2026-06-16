import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { removeGroupMember } from '../application/removeGroupMember';

export const removeGroupMemberController = asyncHandler(async (req, res) => {
	const result = await removeGroupMember(
		String(req.params.id),
		String(req.params.userId),
	);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUP_MEMBER_REMOVED',
		message: 'USER_GROUP_MEMBER_REMOVED',
		ns: 'user-groups',
		data: result,
	});
});
