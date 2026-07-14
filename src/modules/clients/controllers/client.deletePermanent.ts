import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteClientPhysical } from '../application/deleteClientPhysical';

export const clientDeletePermanentController = asyncHandler(
	async (req, res) => {
		const id = String(req.params.id);
		const data = await deleteClientPhysical(id);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_CLIENT_PERMANENTLY_DELETED',
			message: 'SUCCESS_CLIENT_PERMANENTLY_DELETED',
			ns: 'clients',
			data,
		});
	},
);
