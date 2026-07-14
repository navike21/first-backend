import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { markFormSubmissionRead } from '../application/markFormSubmissionRead';

export const formSubmissionMarkReadController = asyncHandler(
	async (req, res) => {
		const data = await markFormSubmissionRead(
			String(req.params.id),
			String(req.params.submissionId),
		);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_FORM_SUBMISSION_MARK_READ',
			message: 'SUCCESS_FORM_SUBMISSION_MARK_READ',
			ns: 'forms',
			data,
		});
	},
);
