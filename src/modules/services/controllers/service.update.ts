import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { updateService } from '../application/updateService';
import { UpdateServiceSchema } from '../schemas/service.schema';

export const serviceUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const parsed = UpdateServiceSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await updateService(id, parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SERVICE_UPDATE',
		message: 'SUCCESS_SERVICE_UPDATE',
		ns: 'services',
		data,
	});
});
