import { QueryFilter } from 'mongoose';

import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import { UserSchema } from '../types/user.schema';
import { BulkDeleteUsersBody } from '../types/userDeleteManyBody';
import UserModel from '../models/user.modelDB';

export const userDeleteLogicalBulk = asyncHandler(async (request, response) => {
	const { ids } = request.body as BulkDeleteUsersBody;

	if (!ids || !Array.isArray(ids) || ids.length === 0) {
		setThrowError({
			statusCode: 400,
			message: 'IDs array is required',
			code: 'ERROR_IDS_REQUIRED',
		});
	}

	const query: QueryFilter<UserSchema> = {
		id: { $in: ids },
		status: ACTIVE,
	};

	const users = await UserModel.find(query).lean();

	if (!users.length) {
		setThrowError({
			statusCode: 404,
			message: 'No active users found to delete',
			code: 'ERROR_USERS_NOT_FOUND',
		});
	}

	await UserModel.updateMany(query, {
		$set: { status: DELETED },
	});

	const cleanedUsers = users.map((user) => cleanMongoFields(user));

	successResponse(response, {
		statusCode: 200,
		message: 'Users deleted successfully',
		code: 'SUCCESS_USERS_DELETED',
		data: cleanedUsers,
	});
});
