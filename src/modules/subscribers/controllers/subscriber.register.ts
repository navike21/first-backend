import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import { registerSubscriber } from '../application/registerSubscriber';
import { SubscriberRegisterSchema } from '../schemas/subscriber.schema';

export const subscriberRegister = asyncHandler(async (req, res) => {
	const input = validate(SubscriberRegisterSchema, parseRequestData(req));
	const result = await registerSubscriber(
		input,
		getUploadedFile(req),
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 201,
		message: 'SUCCESS_SUBSCRIBER_REGISTER',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBER_REGISTER',
		data: result.data,
		warnings: result.warnings,
	});
});
