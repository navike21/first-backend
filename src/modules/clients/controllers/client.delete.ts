import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteClientLogical } from '../application/deleteClientLogical';

export const clientDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteClientLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CLIENT_DELETED',
		message: 'SUCCESS_CLIENT_DELETED',
		ns: 'clients',
		data,
	});
});
