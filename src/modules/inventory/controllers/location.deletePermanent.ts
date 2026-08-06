import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteLocationPhysical } from '../application/deleteLocationPhysical';

export const locationDeletePermanentController = asyncHandler(
	async (req, res) => {
		const id = String(req.params.id);
		const data = await deleteLocationPhysical(id);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_LOCATION_PURGED',
			message: 'SUCCESS_LOCATION_PURGED',
			ns: 'inventory',
			data,
		});
	},
);
