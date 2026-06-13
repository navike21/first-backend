import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteUserLogical } from '../application/deleteUserLogical';

export const deleteUserLogicalController = asyncHandler(async (req, res) => {
	const data = await deleteUserLogical(
		String(req.params.id),
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_SOFT_DELETED',
		message: 'USER_SOFT_DELETED',
		ns: 'users',
		data,
	});
});
