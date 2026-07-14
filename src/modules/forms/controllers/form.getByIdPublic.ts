import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getPublicFormById } from '../application/getPublicFormById';

export const formGetByIdPublicController = asyncHandler(async (req, res) => {
	const data = await getPublicFormById(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_GET',
		message: 'SUCCESS_FORM_GET',
		ns: 'forms',
		data,
	});
});
