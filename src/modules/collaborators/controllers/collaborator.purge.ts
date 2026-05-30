import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { purgeCollaborator } from '../application/purgeCollaborator';

export const collaboratorPurgeController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await purgeCollaborator(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COLLABORATOR_PURGED',
		message: 'SUCCESS_COLLABORATOR_PURGED',
		ns: 'collaborators',
		data,
	});
});
