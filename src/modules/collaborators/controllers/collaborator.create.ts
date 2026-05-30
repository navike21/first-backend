import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { createCollaborator } from '../application/createCollaborator';
import { CreateCollaboratorSchema } from '../schemas/collaborator.schema';

export const collaboratorCreateController = asyncHandler(async (req, res) => {
	const parsed = CreateCollaboratorSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await createCollaborator(parsed.data);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_COLLABORATOR_CREATE',
		message: 'SUCCESS_COLLABORATOR_CREATE',
		ns: 'collaborators',
		data,
	});
});
