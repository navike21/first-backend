import { QueryFilter } from 'mongoose';

import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import { UserSchema } from '../types/user.schema';
import UserModel from '../models/user.modelDB';

export const userDeleteLogical = asyncHandler(async (request, response) => {
	const { id } = request.params;

	const query: QueryFilter<UserSchema> = {
		id,
		status: ACTIVE,
	};
	const user = await UserModel.findOne(query).lean();

	if (!user) {
		setThrowError({
			statusCode: 404,
			message: 'User not found',
			code: 'ERROR_USER_NOT_FOUND',
		});
	}

	user.status = DELETED;
	await UserModel.findOneAndUpdate(query, user, { new: true }).lean();

	successResponse(response, {
		statusCode: 200,
		message: 'User deleted successfully',
		code: 'SUCCESS_USER_DELETED',
		data: cleanMongoFields(user),
	});
});
