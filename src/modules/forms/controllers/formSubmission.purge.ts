import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { purgeFormSubmission } from '../application/purgeFormSubmission';

export const formSubmissionPurgeController = asyncHandler(async (req, res) => {
	const data = await purgeFormSubmission(
		String(req.params.id),
		String(req.params.submissionId),
	);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_FORM_SUBMISSION_PERMANENTLY_DELETE',
		message: 'SUCCESS_FORM_SUBMISSION_PERMANENTLY_DELETE',
		ns: 'forms',
		data,
	});
});
