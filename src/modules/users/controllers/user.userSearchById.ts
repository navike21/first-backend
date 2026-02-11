import { asyncHandler } from '@Middlewares/asyncHandler';
import { QueryFilter } from 'mongoose';

import { UserSchema } from '../types/user.schema';
import UserModel from '../models/user.modelDB';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

export const userSearchById = asyncHandler(async (request, response) => {
	const { id } = request.params;

	const query: QueryFilter<UserSchema> = {
		id,
	};
	const user = await UserModel.findOne(query).lean();

	if (!user) {
		setThrowError({
			statusCode: 404,
			message: 'User not found',
			code: 'ERROR_USER_NOT_FOUND',
		});
	}

	successResponse(response, {
		statusCode: 200,
		message: 'User found successfully',
		code: 'SUCCESS_USER_FOUND',
		data: cleanMongoFields(user),
	});
});
