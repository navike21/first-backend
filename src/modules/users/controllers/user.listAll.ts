import { QueryFilter } from 'mongoose';

import { ACTIVE } from '@Constants/statusRegister';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation, paramsInformation } from '@Helpers/metaInformation';
import setThrowError from '@Helpers/setThrowError';
import { asyncHandler } from '@Middlewares/asyncHandler';

import UserModel from '../models/user.modelDB';
import { UserSchema } from '../types/user.schema';

export const userListAll = asyncHandler(async (request, response) => {
	const { limitNumber, pageNumber, statusParam, skip } =
		paramsInformation(request);

	const query: QueryFilter<UserSchema> = {
		status: statusParam ?? ACTIVE,
	};

	const [data, total] = await Promise.all([
		UserModel.find(query).skip(skip).limit(limitNumber).lean(),
		UserModel.countDocuments(query),
	]);

	if (data.length === 0) {
		setThrowError({
			statusCode: 404,
			message: 'User list empty',
			code: 'USER_LIST_EMPTY',
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
		message: 'User list retrieved successfully',
		code: 'SUCCESS_USER_LIST',
		data: cleanedUserList,
		meta,
	});
});
