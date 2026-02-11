import { QueryFilter } from 'mongoose';

import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import type { ClientSchema } from '../types/client.schema';
import ClientModel from '../models/client.modelDB';

import { BulkDeleteClientsSchema } from '../schemas/clientBulkDeleteClientsSchema';

export const clientDeletePhysicalBulk = asyncHandler(
	async (request, response) => {
		const parsedBody = BulkDeleteClientsSchema.safeParse(request.body);

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

		const query: QueryFilter<ClientSchema> = {
			id: { $in: ids },
		};

		const clients = await ClientModel.find(query).lean();

		const foundIds = clients
			.map((client) => client.id)
			.filter((id): id is string => Boolean(id));

		const notFoundIds = ids.filter((id) => !foundIds.includes(id));

		if (foundIds.length === 0) {
			successResponse(response, {
				statusCode: 200,
				message: 'No clients were deleted',
				code: 'SUCCESS_NO_CLIENTS_DELETED',
				data: {
					deleted: [],
					deletedIds: [],
					notFoundIds,
				},
			});
			return;
		}

		await ClientModel.deleteMany({ id: { $in: foundIds } });

		const cleanedClients = clients.map((client) => cleanMongoFields(client));

		if (notFoundIds.length === 0) {
			successResponse(response, {
				statusCode: 200,
				message: 'Clients deleted successfully',
				code: 'SUCCESS_CLIENTS_DELETED',
				data: {
					deleted: cleanedClients,
					deletedIds: foundIds,
					notFoundIds: [],
				},
			});
			return;
		}

		successResponse(response, {
			statusCode: 200,
			message: 'Clients deleted partially',
			code: 'SUCCESS_CLIENTS_PARTIALLY_DELETED',
			data: {
				deleted: cleanedClients,
				deletedIds: foundIds,
				notFoundIds,
			},
		});
	},
);
