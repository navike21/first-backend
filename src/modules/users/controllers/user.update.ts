import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import { UpdateUserSchema } from '../schemas/user.schema';
import { updateUser } from '../application/updateUser';

export const updateUserController = asyncHandler(async (req, res) => {
	const validated = validate(UpdateUserSchema, parseRequestData(req));

	const result = await updateUser(
		String(req.params.id),
		validated,
		getUploadedFile(req),
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_UPDATED',
		message: 'USER_UPDATED',
		ns: 'users',
		data: result.data,
		warnings: result.warnings,
	});
});
