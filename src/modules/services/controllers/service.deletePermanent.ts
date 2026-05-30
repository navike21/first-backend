import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteServicePhysical } from '../application/deleteServicePhysical';

export const serviceDeletePermanentController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteServicePhysical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SERVICE_PERMANENTLY_DELETED',
		message: 'SUCCESS_SERVICE_PERMANENTLY_DELETED',
		ns: 'services',
		data,
	});
});
