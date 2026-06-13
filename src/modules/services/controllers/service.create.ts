import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import { createService } from '../application/createService';
import { CreateServiceSchema } from '../schemas/service.schema';

export const serviceCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateServiceSchema, parseRequestData(req));

	const result = await createService(
		validated,
		getUploadedFile(req),
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_SERVICE_CREATE',
		message: 'SUCCESS_SERVICE_CREATE',
		ns: 'services',
		data: result.data,
		warnings: result.warnings,
	});
});
