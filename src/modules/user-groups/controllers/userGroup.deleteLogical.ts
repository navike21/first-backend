import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteUserGroupLogical } from '../application/deleteUserGroupLogical';

export const deleteUserGroupLogicalController = asyncHandler(
	async (req, res) => {
		const data = await deleteUserGroupLogical(String(req.params.id));
		successResponse(res, {
			statusCode: 200,
			code: 'USER_GROUP_SOFT_DELETED',
			message: 'USER_GROUP_SOFT_DELETED',
			ns: 'user-groups',
			data,
		});
	},
);
