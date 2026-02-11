import { QueryFilter } from 'mongoose';

import { ACTIVE } from '@Constants/statusRegister';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation, paramsInformation } from '@Helpers/metaInformation';
import setThrowError from '@Helpers/setThrowError';
import { asyncHandler } from '@Middlewares/asyncHandler';

import ClientModel from '../models/client.modelDB';
import type { ClientSchema } from '../types/client.schema';

export const clientListAll = asyncHandler(async (request, response) => {
	const { limitNumber, pageNumber, statusParam, skip } =
		paramsInformation(request);

	const query: QueryFilter<ClientSchema> = {
		status: statusParam ?? ACTIVE,
	};

	const [data, total] = await Promise.all([
		ClientModel.find(query)
			.skip(skip)
			.limit(limitNumber)
			.select({
				id: 1,
				clientType: 1,
				companyInformation: 1,
				brandingInformation: 1,
				contactInformation: 1,
				status: 1,
			})
			.lean(),
		ClientModel.countDocuments(query),
	]);

	if (data.length === 0) {
		setThrowError({
			statusCode: 404,
			message: 'Client list empty',
			code: 'CLIENT_LIST_EMPTY',
		});
	}

	const meta = metaInformation({
		page: pageNumber,
		limit: limitNumber,
		total,
	});

	const cleanedClientList = data.map((item) => cleanMongoFields(item));

	successResponse(response, {
		statusCode: 200,
		message: 'Client list retrieved successfully',
		code: 'SUCCESS_CLIENT_LIST',
		data: cleanedClientList,
		meta,
	});
});
