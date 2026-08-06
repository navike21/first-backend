import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteLocationLogical } from '../application/deleteLocationLogical';

export const locationDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteLocationLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_LOCATION_DELETED',
		message: 'SUCCESS_LOCATION_DELETED',
		ns: 'inventory',
		data,
	});
});
