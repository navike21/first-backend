import { asyncHandler } from '@Middlewares/asyncHandler';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';

import { SubscriberSchema } from '../types/subscriber.schema';
import SubscriberModel from '../models/subscriber.modelDB';
import setThrowError from '@Helpers/setThrowError';

export const subscriberRegisterBulk = asyncHandler(
	async (request, response) => {
		const subscribersRequest = request.body as SubscriberSchema[];

		if (!Array.isArray(subscribersRequest) || subscribersRequest.length === 0) {
			setThrowError({
				statusCode: 400,
				message: 'No subscribers provided for bulk registration',
				code: 'ERROR_NO_SUBSCRIBERS_PROVIDED',
			});
		}

		try {
			const registerResponse = await SubscriberModel.insertMany(
				subscribersRequest,
				{
					ordered: false,
				},
			);

			const dataResponse = registerResponse.map((subscriber) =>
				cleanMongoFields(
					subscriber.toObject({ versionKey: false, getters: true }),
				),
			);

			successResponse(response, {
				statusCode: 201,
				message: 'Subscribers registered successfully',
				code: 'SUCCESS_SUBSCRIBERS_REGISTER_BULK',
				data: dataResponse,
			});
		} catch (error: unknown) {
			const mongoError = error as any;

			// Manejo de error E11000 (duplicate key)
			if (mongoError.code === 11000) {
				setThrowError({
					statusCode: 409,
					message:
						'One or more subscribers already exist with duplicate unique fields',
					code: 'ERROR_DUPLICATE_SUBSCRIBER',
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
					message: 'Validation error in one or more subscribers',
					code: 'ERROR_VALIDATION_FAILED',
					details: mongoError.errors,
				});
			}

			// Re-lanzar otros errores no esperados
			throw error;
		}
	},
);
