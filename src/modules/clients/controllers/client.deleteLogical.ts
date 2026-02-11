import { QueryFilter } from 'mongoose';

import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import type { ClientSchema } from '../types/client.schema';
import ClientModel from '../models/client.modelDB';

export const clientDeleteLogical = asyncHandler(async (request, response) => {
	const { id } = request.params;

	const query: QueryFilter<ClientSchema> = {
		id,
		status: ACTIVE,
	};
	const client = await ClientModel.findOne(query).lean();

	if (!client) {
		setThrowError({
			statusCode: 404,
			message: 'Client not found',
			code: 'ERROR_CLIENT_NOT_FOUND',
		});
	}

	client.status = DELETED;
	await ClientModel.findOneAndUpdate(query, client, { new: true }).lean();

	successResponse(response, {
		statusCode: 200,
		message: 'Client deleted successfully',
		code: 'SUCCESS_CLIENT_DELETED',
		data: cleanMongoFields(client),
	});
});
