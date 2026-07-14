import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteFormSubmission } from '../application/deleteFormSubmission';

export const formSubmissionDeleteController = asyncHandler(async (req, res) => {
	const data = await deleteFormSubmission(
		String(req.params.id),
		String(req.params.submissionId),
	);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_SUBMISSION_SOFT_DELETE',
		message: 'SUCCESS_FORM_SUBMISSION_SOFT_DELETE',
		ns: 'forms',
		data,
	});
});
