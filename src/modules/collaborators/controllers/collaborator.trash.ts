import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedCollaborators } from '../application/listDeletedCollaborators';

export const collaboratorTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedCollaborators({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COLLABORATOR_TRASH_LIST',
		message: 'SUCCESS_COLLABORATOR_TRASH_LIST',
		ns: 'collaborators',
		data,
		meta,
	});
});
