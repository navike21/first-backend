import { QueryFilter } from 'mongoose';

import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import { UserSchema } from '../types/user.schema';
import UserModel from '../models/user.modelDB';

import { BulkDeleteUsersSchema } from '../schemas/userBulkDeleteUsersSchema';

export const userDeletePhysicalBulk = asyncHandler(
	async (request, response) => {
		const parsedBody = BulkDeleteUsersSchema.safeParse(request.body);

		if (!parsedBody.success) {
			setThrowError({
				statusCode: 400,
				message: parsedBody.error.issues
					.map((issue) => issue.message)
					.join(', '),
				code: 'ERROR_INVALID_BODY',
			});
		}

		const { ids } = parsedBody.data;

		const query: QueryFilter<UserSchema> = {
			id: { $in: ids },
		};

		const users = await UserModel.find(query).lean();

		const foundIds = users
			.map((user) => user.id)
			.filter((id): id is string => Boolean(id));

		const notFoundIds = ids.filter((id) => !foundIds.includes(id));

		// 🟥 Caso 3: ninguno existe
		if (foundIds.length === 0) {
			successResponse(response, {
				statusCode: 200,
				message: 'No users were deleted',
				code: 'SUCCESS_NO_USERS_DELETED',
				data: {
					deleted: [],
					deletedIds: [],
					notFoundIds,
				},
			});
			return;
		}

		await UserModel.deleteMany({ id: { $in: foundIds } });

		const cleanedUsers = users.map((user) => cleanMongoFields(user));

		// 🟩 Caso 1: todos eliminados
		if (notFoundIds.length === 0) {
			successResponse(response, {
				statusCode: 200,
				message: 'Users deleted successfully',
				code: 'SUCCESS_USERS_DELETED',
				data: {
					deleted: cleanedUsers,
					deletedIds: foundIds,
					notFoundIds: [],
				},
			});
			return;
		}

		// 🟨 Caso 2: eliminación parcial
		successResponse(response, {
			statusCode: 200,
			message: 'Users deleted partially',
			code: 'SUCCESS_USERS_PARTIALLY_DELETED',
			data: {
				deleted: cleanedUsers,
				deletedIds: foundIds,
				notFoundIds,
			},
		});
	},
);
