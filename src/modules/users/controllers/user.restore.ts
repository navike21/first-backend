import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreUser } from '../application/restoreUser';

export const userRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreUser(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_USER_RESTORED',
		message: 'SUCCESS_USER_RESTORED',
		ns: 'users',
		data,
	});
});
