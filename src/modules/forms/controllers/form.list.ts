import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listForms } from '../application/listForms';
import { ListFormsQuerySchema } from '../schemas/form.schema';

export const formListController = asyncHandler(async (req, res) => {
	const query = ListFormsQuerySchema.parse(req.query);
	const { data, meta } = await listForms(query);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_LIST',
		message: 'SUCCESS_FORM_LIST',
		ns: 'forms',
		data,
		meta,
	});
});
