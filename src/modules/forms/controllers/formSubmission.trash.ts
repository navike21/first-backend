import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedFormSubmissions } from '../application/listDeletedFormSubmissions';

export const formSubmissionTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedFormSubmissions({
		formId: String(req.params.id),
		page,
		limit,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_SUBMISSION_TRASH_LIST',
		message: 'SUCCESS_FORM_SUBMISSION_TRASH_LIST',
		ns: 'forms',
		data,
		meta,
	});
});
