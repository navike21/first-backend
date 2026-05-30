import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getCollaboratorById } from '../application/getCollaboratorById';

export const collaboratorGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getCollaboratorById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COLLABORATOR_FOUND',
		message: 'SUCCESS_COLLABORATOR_FOUND',
		ns: 'collaborators',
		data,
	});
});
