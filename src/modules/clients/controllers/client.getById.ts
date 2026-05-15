import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getClientById } from '../application/getClientById';

export const clientGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getClientById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CLIENT_FOUND',
		message: 'SUCCESS_CLIENT_FOUND',
		ns: 'clients',
		data,
	});
});
