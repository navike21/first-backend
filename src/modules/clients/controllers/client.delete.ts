import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import ClientModel from '../models/client.modelDB';

export const clientDeletePhysical = asyncHandler(async (request, response) => {
	const { id } = request.params;

	const deletedClient = await ClientModel.findOneAndDelete({ id }).lean();

	if (!deletedClient) {
		setThrowError({
			statusCode: 404,
			message: 'Client not found',
			code: 'ERROR_CLIENT_NOT_FOUND',
		});
	}

	successResponse(response, {
		statusCode: 200,
		message: 'Client permanently deleted successfully',
		code: 'SUCCESS_CLIENT_DELETED_PHYSICAL',
		data: cleanMongoFields(deletedClient),
	});
});
