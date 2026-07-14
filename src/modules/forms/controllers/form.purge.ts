import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { purgeForm } from '../application/purgeForm';

export const formPurgeController = asyncHandler(async (req, res) => {
	const data = await purgeForm(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_PERMANENTLY_DELETE',
		message: 'SUCCESS_FORM_PERMANENTLY_DELETE',
		ns: 'forms',
		data,
	});
});
