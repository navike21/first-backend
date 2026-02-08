import { asyncHandler } from '@Middlewares/asyncHandler';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';

import { UserSchema } from '../types/user.schema';
import UserModel from '../models/user.modelDB';
import setThrowError from '@Helpers/setThrowError';

export const userRegisterBulk = asyncHandler(async (request, response) => {
	const usersRequest = request.body as UserSchema[];

	if (!Array.isArray(usersRequest) || usersRequest.length === 0) {
		setThrowError({
			statusCode: 400,
			message: 'No users provided for bulk registration',
			code: 'ERROR_NO_USERS_PROVIDED',
		});
	}

	const registerResponse = await UserModel.insertMany(usersRequest, {
		ordered: true, // si uno falla, se detiene (puedes poner false si quieres que continúe)
	});

	const dataResponse = registerResponse.map((user) =>
		cleanMongoFields(user.toObject({ versionKey: false, getters: true })),
	);

	successResponse(response, {
		statusCode: 201,
		message: 'Users registered successfully',
		code: 'SUCCESS_USERS_REGISTER_BULK',
		data: dataResponse,
	});
});
