import { asyncHandler } from '@Middlewares/asyncHandler';
import userModelDB from '../models/user.modelDB';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';

export const userUpdate = asyncHandler(async (request, response) => {
	const userId = request.params.id;
	const userRequest = request.body;

	const updatedUser = await userModelDB.findByIdAndUpdate(
		userId,
		{ $set: userRequest },
		{ new: true, runValidators: true },
	);

	if (!updatedUser) {
		setThrowError({
			statusCode: 404,
			message: 'User not found',
			code: 'USER_NOT_FOUND',
		});
	}

	const dataResponse = cleanMongoFields(
		updatedUser.toObject({ versionKey: false, getters: true }),
	);

	const sanitizedUser = {
		...dataResponse,
		adminInformation: {
			...dataResponse.adminInformation,
			password: undefined,
		},
	};

	successResponse(response, {
		statusCode: 200,
		message: 'User updated successfully',
		code: 'SUCCESS_USER_UPDATE',
		data: sanitizedUser,
	});
});
