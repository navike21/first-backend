import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { createClient } from '../application/createClient';
import { CreateClientSchema } from '../schemas/client.schema';
import setThrowError from '@Helpers/setThrowError';

export const clientCreateController = asyncHandler(async (req, res) => {
	const parsed = CreateClientSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
		});
	}

	const data = await createClient(parsed.data!);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_CLIENT_CREATE',
		message: 'SUCCESS_CLIENT_CREATE',
		ns: 'clients',
		data,
	});
});
