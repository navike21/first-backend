import { asyncHandler } from '@Middlewares/asyncHandler';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';

import type { ClientSchema } from '../types/client.schema';
import ClientModel from '../models/client.modelDB';

export const clientRegisterBulk = asyncHandler(async (request, response) => {
	const clientsRequest = request.body as ClientSchema[];

	if (!Array.isArray(clientsRequest) || clientsRequest.length === 0) {
		setThrowError({
			statusCode: 400,
			message: 'No clients provided for bulk registration',
			code: 'ERROR_NO_CLIENTS_PROVIDED',
		});
	}

	const registerResponse = await ClientModel.insertMany(clientsRequest, {
		ordered: true,
	});

	const dataResponse = registerResponse.map((client) =>
		cleanMongoFields(client.toObject({ versionKey: false, getters: true })),
	);

	successResponse(response, {
		statusCode: 201,
		message: 'Clients registered successfully',
		code: 'SUCCESS_CLIENTS_REGISTER_BULK',
		data: dataResponse,
	});
});
