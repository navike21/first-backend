import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { createService } from '../application/createService';
import { CreateServiceSchema } from '../schemas/service.schema';

export const serviceCreateController = asyncHandler(async (req, res) => {
	const parsed = CreateServiceSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await createService(parsed.data);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_SERVICE_CREATE',
		message: 'SUCCESS_SERVICE_CREATE',
		ns: 'services',
		data,
	});
});
