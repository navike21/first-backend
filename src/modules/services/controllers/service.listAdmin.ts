import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listServicesAdmin } from '../application/listServicesAdmin';
import { ListServicesQuerySchema } from '../schemas/service.schema';

export const serviceListAdminController = asyncHandler(async (req, res) => {
	const query = ListServicesQuerySchema.parse(req.query);
	const { data, meta } = await listServicesAdmin({
		page: query.page,
		limit: query.limit,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SERVICE_LIST',
		message: 'SUCCESS_SERVICE_LIST',
		ns: 'services',
		data,
		meta,
	});
});
