import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import UserModel from '../models/user.modelDB';

export const userDeletePhysical = asyncHandler(async (request, response) => {
	const { id } = request.params;

	const deletedUser = await UserModel.findOneAndDelete({ id }).lean();

	if (!deletedUser) {
		setThrowError({
			statusCode: 404,
			message: 'User not found',
			code: 'ERROR_USER_NOT_FOUND',
		});
	}

	successResponse(response, {
		statusCode: 200,
		message: 'User permanently deleted successfully',
		code: 'SUCCESS_USER_DELETED_PHYSICAL',
		data: cleanMongoFields(deletedUser),
	});
});
