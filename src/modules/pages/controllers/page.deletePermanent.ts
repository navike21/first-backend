import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deletePagePhysical } from '../application/deletePagePhysical';

export const pageDeletePermanentController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const data = await deletePagePhysical(slug);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_PERMANENTLY_DELETED',
		message: 'SUCCESS_PAGE_PERMANENTLY_DELETED',
		ns: 'pages',
		data,
	});
});
