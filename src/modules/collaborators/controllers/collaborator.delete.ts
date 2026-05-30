import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteCollaborator } from '../application/deleteCollaborator';

export const collaboratorDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteCollaborator(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COLLABORATOR_DELETED',
		message: 'SUCCESS_COLLABORATOR_DELETED',
		ns: 'collaborators',
		data,
	});
});
