import { QueryFilter } from 'mongoose';

import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import { UserSchema } from '../types/user.schema';
import UserModel from '../models/user.modelDB';

import { BulkDeleteUsersSchema } from '../schemas/userBulkDeleteUsersSchema';

export const userDeleteLogicalBulk = asyncHandler(async (request, response) => {
	const parsedBody = BulkDeleteUsersSchema.safeParse(request.body);

	if (!parsedBody.success) {
		setThrowError({
			statusCode: 400,
			message: parsedBody.error.issues.map((issue) => issue.message).join(', '),
			code: 'ERROR_INVALID_BODY',
		});
	}

	const { ids } = parsedBody.data;

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
