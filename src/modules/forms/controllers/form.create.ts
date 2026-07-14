import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createForm } from '../application/createForm';
import { CreateFormSchema } from '../schemas/form.schema';

export const formCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateFormSchema, req.body);

	const data = await createForm(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_FORM_CREATE',
		message: 'SUCCESS_FORM_CREATE',
		ns: 'forms',
		data,
	});
});
