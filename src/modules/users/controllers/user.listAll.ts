import { QueryFilter } from 'mongoose';
import { asyncHandler } from '@Middlewares/asyncHandler';

import userSchema from '../models/user.modelDB';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ACTIVE } from '@Constants/statusRegister';
import { UserSchema } from '../types/user.schema';

export const userListAll = asyncHandler(async (request, response) => {
	const { limit = 10, page = 1, status } = request.query;

	const limitNumber = Number(limit);
	const pageNumber = Number(page);

	const query: QueryFilter<UserSchema> = {
		status: status ?? ACTIVE,
	};

	const skip = (pageNumber - 1) * limitNumber;

	const [data, total] = await Promise.all([
		userSchema.find(query).skip(skip).limit(limitNumber).lean(),
		userSchema.countDocuments(query),
	]);

	const meta = {
		page: pageNumber,
		limit: limitNumber,
		total,
		totalPages: Math.ceil(total / limitNumber),
	};

	const cleanedUserList = data.map((item) => {
		return cleanMongoFields(item);
	});

	successResponse(response, {
		statusCode: 200,
		message: 'User List Successfully',
		code: 'success_user_list',
		data: cleanedUserList,
		meta,
	});
});
