import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { dispatchPendingEmails } from '../application/dispatchOutbox';

/**
 * Drena el outbox: lo invoca el trigger del worker (schedule de QStash). El
 * cuerpo se ignora — el estado vive en la colección `email_outbox`.
 */
export const emailDispatchController = asyncHandler(async (_req, res) => {
	const result = await dispatchPendingEmails();
	successResponse(res, {
		statusCode: 200,
		code: 'EMAIL_DISPATCH_OK',
		message: 'Email outbox dispatched',
		data: result,
	});
});
