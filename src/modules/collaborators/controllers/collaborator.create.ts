import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import { createCollaborator } from '../application/createCollaborator';
import { CreateCollaboratorSchema } from '../schemas/collaborator.schema';

export const collaboratorCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateCollaboratorSchema, parseRequestData(req));

	const result = await createCollaborator(
		validated,
		getUploadedFile(req),
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_COLLABORATOR_CREATE',
		message: 'SUCCESS_COLLABORATOR_CREATE',
		ns: 'collaborators',
		data: result.data,
		warnings: result.warnings,
	});
});
