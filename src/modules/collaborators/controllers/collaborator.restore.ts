import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreCollaborator } from '../application/restoreCollaborator';

export const collaboratorRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreCollaborator(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COLLABORATOR_RESTORED',
		message: 'SUCCESS_COLLABORATOR_RESTORED',
		ns: 'collaborators',
		data,
	});
});
