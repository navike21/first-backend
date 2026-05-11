import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getUserGroupById } from '../application/getUserGroupById';

export const getUserGroupByIdController = asyncHandler(async (req, res) => {
	const group = await getUserGroupById(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		code: 'USER_GROUP_FOUND',
		message: 'USER_GROUP_FOUND',
		ns: 'user-groups',
		data: group,
	});
});
