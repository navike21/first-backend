import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listServicesPublic } from '../application/listServicesPublic';
import { ListServicesQuerySchema } from '../schemas/service.schema';

export const serviceListPublicController = asyncHandler(async (req, res) => {
	const query = ListServicesQuerySchema.parse(req.query);
	const { data, meta } = await listServicesPublic({
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
