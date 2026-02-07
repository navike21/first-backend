import { QueryFilter } from 'mongoose';
import { asyncHandler } from '@Middlewares/asyncHandler';

import userSchema from '../models/user.modelDB';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ACTIVE } from '@Constants/statusRegister';
import { UserSchema } from '../types/user.schema';
import { metaInformation, paramsInformation } from '@Helpers/metaInformation';
import setThrowError from '@Helpers/setThrowError';

export const userListAll = asyncHandler(async (request, response) => {
	const { limitNumber, pageNumber, statusParam, skip } =
		paramsInformation(request);

	const query: QueryFilter<UserSchema> = {
		status: statusParam ?? ACTIVE,
	};

	const [data, total] = await Promise.all([
		userSchema.find(query).skip(skip).limit(limitNumber).lean(),
		userSchema.countDocuments(query),
	]);

	if (data.length === 0) {
		setThrowError({
			statusCode: 404,
			message: 'No users found',
			code: 'error_no_users_found',
		});
	}

	const meta = metaInformation({
		page: pageNumber,
		limit: limitNumber,
		total,
	});

	const cleanedUserList = data.map((item) => cleanMongoFields(item));

	successResponse(response, {
		statusCode: 200,
		message: 'User List Successfully',
		code: 'success_user_list',
		data: cleanedUserList,
		meta,
	});
});
