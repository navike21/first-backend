import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteServiceLogical } from '../application/deleteServiceLogical';

export const serviceDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteServiceLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SERVICE_DELETED',
		message: 'SUCCESS_SERVICE_DELETED',
		ns: 'services',
		data,
	});
});
