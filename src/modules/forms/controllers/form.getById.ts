import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getFormById } from '../application/getFormById';

export const formGetByIdController = asyncHandler(async (req, res) => {
	const data = await getFormById(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_GET',
		message: 'SUCCESS_FORM_GET',
		ns: 'forms',
		data,
	});
});
