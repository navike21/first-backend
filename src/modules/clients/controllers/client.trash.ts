import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedClients } from '../application/listDeletedClients';

export const clientTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const result = await listDeletedClients({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CLIENT_TRASH_LIST',
		message: 'SUCCESS_CLIENT_TRASH_LIST',
		ns: 'clients',
		data: result,
	});
});
