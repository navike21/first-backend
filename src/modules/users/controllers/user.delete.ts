import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteUser } from '../application/deleteUser';

export const deleteUserController = asyncHandler(async (req, res) => {
	await deleteUser(
		String(req.params.id),
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_DELETED',
		message: 'USER_DELETED',
		ns: 'users',
		data: null,
	});
});
