import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreClient } from '../application/restoreClient';

export const clientRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreClient(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CLIENT_RESTORED',
		message: 'SUCCESS_CLIENT_RESTORED',
		ns: 'clients',
		data,
	});
});
