import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreFormSubmission } from '../application/restoreFormSubmission';

export const formSubmissionRestoreController = asyncHandler(
	async (req, res) => {
		const data = await restoreFormSubmission(
			String(req.params.id),
			String(req.params.submissionId),
		);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_FORM_SUBMISSION_RESTORE',
			message: 'SUCCESS_FORM_SUBMISSION_RESTORE',
			ns: 'forms',
			data,
		});
	},
);
