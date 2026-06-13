import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import { updateClient } from '../application/updateClient';
import { UpdateClientSchema } from '../schemas/client.schema';

export const clientUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateClientSchema, parseRequestData(req));

	const result = await updateClient(
		id,
		validated,
		getUploadedFile(req),
		res.locals.userId as string | undefined,
	);

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CLIENT_UPDATE',
		message: 'SUCCESS_CLIENT_UPDATE',
		ns: 'clients',
		data: result.data,
		warnings: result.warnings,
	});
});
