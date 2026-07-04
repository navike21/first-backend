import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFileField } from '@Helpers/multipartRequest';
import { updateService } from '../application/updateService';
import { UpdateServiceSchema } from '../schemas/service.schema';

export const serviceUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateServiceSchema, parseRequestData(req));

	const result = await updateService(
		id,
		validated,
		{
			cover: getUploadedFileField(req, 'cover'),
			icon: getUploadedFileField(req, 'icon'),
		},
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SERVICE_UPDATE',
		message: 'SUCCESS_SERVICE_UPDATE',
		ns: 'services',
		data: result.data,
		warnings: result.warnings,
	});
});
