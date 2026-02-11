import { asyncHandler } from '@Middlewares/asyncHandler';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';

import { UserSchema } from '../types/user.schema';
import UserModel from '../models/user.modelDB';
import setThrowError from '@Helpers/setThrowError';

export const userRegisterBulk = asyncHandler(async (request, response) => {
	const usersRequest = request.body as UserSchema[];

	if (!Array.isArray(usersRequest) || usersRequest.length === 0) {
		setThrowError({
			statusCode: 400,
			message: 'No users provided for bulk registration',
			code: 'ERROR_NO_USERS_PROVIDED',
		});
	}

	try {
		const registerResponse = await UserModel.insertMany(usersRequest, {
			ordered: false,
		});

		const dataResponse = registerResponse.map((user) =>
			cleanMongoFields(user.toObject({ versionKey: false, getters: true })),
		);

		successResponse(response, {
			statusCode: 201,
			message: 'Users registered successfully',
			code: 'SUCCESS_USERS_REGISTER_BULK',
			data: dataResponse,
		});
	} catch (error: unknown) {
		const mongoError = error as any;

		// Manejo de error E11000 (duplicate key)
		if (mongoError.code === 11000) {
			setThrowError({
				statusCode: 409,
				message: 'One or more users already exist with duplicate unique fields',
				code: 'ERROR_DUPLICATE_USER',
				details: {
					duplicateField: Object.keys(mongoError.keyPattern || {}),
					duplicateValue: mongoError.keyValue,
				},
			});
		}

		// Manejo de errores de validación
		if (mongoError.errors) {
			setThrowError({
				statusCode: 400,
				message: 'Validation error in one or more users',
				code: 'ERROR_VALIDATION_FAILED',
				details: mongoError.errors,
			});
		}

		// Re-lanzar otros errores no esperados
		throw error;
	}
});
