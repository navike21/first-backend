import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreForm } from '../application/restoreForm';

export const formRestoreController = asyncHandler(async (req, res) => {
	const data = await restoreForm(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_RESTORE',
		message: 'SUCCESS_FORM_RESTORE',
		ns: 'forms',
		data,
	});
});
