import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getServiceById } from '../application/getServiceById';

export const serviceGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getServiceById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SERVICE_FOUND',
		message: 'SUCCESS_SERVICE_FOUND',
		ns: 'services',
		data,
	});
});
