import { asyncHandler } from '@Middlewares/asyncHandler';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';

import type { ClientSchema } from '../types/client.schema';
import ClientModel from '../models/client.modelDB';

export const clientRegister = asyncHandler(async (request, response) => {
	const clientRequest = request.body as ClientSchema;

	const registerResponse = await ClientModel.create(clientRequest);
	const dataResponse = cleanMongoFields(
		registerResponse.toObject({ versionKey: false, getters: true }),
	);

	successResponse(response, {
		statusCode: 201,
		message: 'Client registered successfully',
		code: 'SUCCESS_CLIENT_REGISTER',
		data: dataResponse,
	});
});
