import { asyncHandler } from '@Middlewares/asyncHandler';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';

import { UserSchema } from '../types/user.schema';
import UserModel from '../models/user.modelDB';

export const userRegister = asyncHandler(async (request, response) => {
	const userRequest = request.body as UserSchema;

	const registerResponse = await UserModel.create(userRequest);
	const dataResponse = cleanMongoFields(
		registerResponse.toObject({ versionKey: false, getters: true }),
	);

	const sanitizedUser = {
		...dataResponse,
		adminInformation: {
			...dataResponse.adminInformation,
			password: undefined,
		},
	};

	successResponse(response, {
		statusCode: 201,
		message: 'User registered successfully',
		code: 'SUCCESS_USER_REGISTER',
		data: sanitizedUser,
	});
});
