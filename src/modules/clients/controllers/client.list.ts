import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listClients } from '../application/listClients';
import { ListClientsQuerySchema } from '../schemas/client.schema';

export const clientListController = asyncHandler(async (req, res) => {
	const query = ListClientsQuerySchema.parse(req.query);
	const { data, meta } = await listClients({
		page: query.page,
		limit: query.limit,
		status: query.status,
		search: query.search,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CLIENT_LIST',
		message: 'SUCCESS_CLIENT_LIST',
		ns: 'clients',
		data,
		meta,
	});
});
