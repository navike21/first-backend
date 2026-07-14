import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { submitForm } from '../application/submitForm';

export const formSubmissionSubmitController = asyncHandler(async (req, res) => {
	const ipAddress =
		(req.headers['x-forwarded-for'] as string | undefined) ??
		req.socket?.remoteAddress;
	const userAgent = req.headers['user-agent'];
	const lang = (res.locals.lang as string | undefined) ?? 'en';

	const data = await submitForm(String(req.params.id), req.body, {
		ipAddress,
		userAgent,
		lang,
	});

	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_FORM_SUBMISSION_CREATE',
		message: 'SUCCESS_FORM_SUBMISSION_CREATE',
		ns: 'forms',
		data,
	});
});
