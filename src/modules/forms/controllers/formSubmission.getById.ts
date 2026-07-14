import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getFormSubmissionById } from '../application/getFormSubmissionById';

export const formSubmissionGetByIdController = asyncHandler(
	async (req, res) => {
		const data = await getFormSubmissionById(
			String(req.params.id),
			String(req.params.submissionId),
		);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_FORM_SUBMISSION_GET',
			message: 'SUCCESS_FORM_SUBMISSION_GET',
			ns: 'forms',
			data,
		});
	},
);
