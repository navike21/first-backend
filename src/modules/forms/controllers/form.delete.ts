import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteForm } from '../application/deleteForm';

export const formDeleteController = asyncHandler(async (req, res) => {
	const data = await deleteForm(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_SOFT_DELETE',
		message: 'SUCCESS_FORM_SOFT_DELETE',
		ns: 'forms',
		data,
	});
});
