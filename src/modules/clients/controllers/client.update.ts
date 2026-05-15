import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { updateClient } from '../application/updateClient';
import { UpdateClientSchema } from '../schemas/client.schema';
import { AppError } from '@Shared/domain/AppError';

export const clientUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const parsed = UpdateClientSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await updateClient(id, parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CLIENT_UPDATE',
		message: 'SUCCESS_CLIENT_UPDATE',
		ns: 'clients',
		data,
	});
});
