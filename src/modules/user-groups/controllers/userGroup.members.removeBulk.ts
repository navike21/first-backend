import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { AddGroupMembersSchema } from '../schemas/userGroup.schema';
import { removeGroupMembersBulk } from '../application/removeGroupMembersBulk';

export const removeGroupMembersBulkController = asyncHandler(
	async (req, res) => {
		// Same body shape as add: `{ userIds: string[] }`.
		const { userIds } = validate(AddGroupMembersSchema, req.body);

		const result = await removeGroupMembersBulk(String(req.params.id), userIds);
		successResponse(res, {
			statusCode: 200,
			code: 'USER_GROUP_MEMBERS_REMOVED',
			message: 'USER_GROUP_MEMBERS_REMOVED',
			ns: 'user-groups',
			data: result,
		});
	},
);
