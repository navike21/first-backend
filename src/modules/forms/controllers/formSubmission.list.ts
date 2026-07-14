import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listFormSubmissions } from '../application/listFormSubmissions';
import { ListFormSubmissionsQuerySchema } from '../schemas/form.schema';

export const formSubmissionListController = asyncHandler(async (req, res) => {
	const query = ListFormSubmissionsQuerySchema.parse(req.query);
	const { data, meta } = await listFormSubmissions({
		formId: String(req.params.id),
		...query,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_SUBMISSION_LIST',
		message: 'SUCCESS_FORM_SUBMISSION_LIST',
		ns: 'forms',
		data,
		meta,
	});
});
