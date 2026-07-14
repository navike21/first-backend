import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateForm } from '../application/updateForm';
import { UpdateFormSchema } from '../schemas/form.schema';

export const formUpdateController = asyncHandler(async (req, res) => {
	const validated = validate(UpdateFormSchema, req.body);

	const data = await updateForm(String(req.params.id), validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_UPDATE',
		message: 'SUCCESS_FORM_UPDATE',
		ns: 'forms',
		data,
	});
});
