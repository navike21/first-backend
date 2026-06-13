import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import { updateCollaborator } from '../application/updateCollaborator';
import { UpdateCollaboratorSchema } from '../schemas/collaborator.schema';

export const collaboratorUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateCollaboratorSchema, parseRequestData(req));

	const result = await updateCollaborator(
		id,
		validated,
		getUploadedFile(req),
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COLLABORATOR_UPDATE',
		message: 'SUCCESS_COLLABORATOR_UPDATE',
		ns: 'collaborators',
		data: result.data,
		warnings: result.warnings,
	});
});
