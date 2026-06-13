import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import { CreateUserSchema } from '../schemas/user.schema';
import { createUser } from '../application/createUser';

export const createUserController = asyncHandler(async (req, res) => {
	const validated = validate(CreateUserSchema, parseRequestData(req));

	const result = await createUser(
		validated,
		res.locals.lang as string,
		getUploadedFile(req),
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 201,
		code: 'USER_CREATED',
		message: 'USER_CREATED',
		ns: 'users',
		data: result.data,
		warnings: result.warnings,
	});
});
