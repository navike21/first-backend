import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { updateCollaborator } from '../application/updateCollaborator';
import { UpdateCollaboratorSchema } from '../schemas/collaborator.schema';

export const collaboratorUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const parsed = UpdateCollaboratorSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await updateCollaborator(id, parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COLLABORATOR_UPDATE',
		message: 'SUCCESS_COLLABORATOR_UPDATE',
		ns: 'collaborators',
		data,
	});
});
