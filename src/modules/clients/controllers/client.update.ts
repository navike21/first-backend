import { asyncHandler } from '@Middlewares/asyncHandler';
import ClientModel from '../models/client.modelDB';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';

export const clientUpdate = asyncHandler(async (request, response) => {
	const clientId = request.params.id;
	const clientRequest = request.body;

	const updatedClient = await ClientModel.findOneAndUpdate(
		{ id: clientId },
		{ $set: clientRequest },
		{ new: true, runValidators: true },
	);

	if (!updatedClient) {
		setThrowError({
			statusCode: 404,
			message: 'Client not found',
			code: 'CLIENT_NOT_FOUND',
		});
	}

	const dataResponse = cleanMongoFields(
		updatedClient.toObject({ versionKey: false, getters: true }),
	);

	successResponse(response, {
		statusCode: 200,
		message: 'Client updated successfully',
		code: 'SUCCESS_CLIENT_UPDATE',
		data: dataResponse,
	});
});
