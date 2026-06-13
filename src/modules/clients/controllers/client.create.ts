import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import { createClient } from '../application/createClient';
import { CreateClientSchema } from '../schemas/client.schema';

export const clientCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateClientSchema, parseRequestData(req));

	const result = await createClient(
		validated,
		getUploadedFile(req),
		res.locals.userId as string | undefined,
	);

	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_CLIENT_CREATE',
		message: 'SUCCESS_CLIENT_CREATE',
		ns: 'clients',
		data: result.data,
		warnings: result.warnings,
	});
});
