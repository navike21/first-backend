import { asyncHandler } from '@Middlewares/asyncHandler';
import { QueryFilter } from 'mongoose';

import type { ClientSchema } from '../types/client.schema';
import ClientModel from '../models/client.modelDB';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

export const clientSearchById = asyncHandler(async (request, response) => {
	const { id } = request.params;

	const query: QueryFilter<ClientSchema> = {
		id,
	};
	const client = await ClientModel.findOne(query).lean();

	if (!client) {
		setThrowError({
			statusCode: 404,
			message: 'Client not found',
			code: 'ERROR_CLIENT_NOT_FOUND',
		});
	}

	successResponse(response, {
		statusCode: 200,
		message: 'Client found successfully',
		code: 'SUCCESS_CLIENT_FOUND',
		data: cleanMongoFields(client),
	});
});
