import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreService } from '../application/restoreService';

export const serviceRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreService(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SERVICE_RESTORED',
		message: 'SUCCESS_SERVICE_RESTORED',
		ns: 'services',
		data,
	});
});
