import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listCollaborators } from '../application/listCollaborators';
import { ListCollaboratorQuerySchema } from '../schemas/collaborator.schema';

export const collaboratorListPublicController = asyncHandler(async (req, res) => {
	const query = ListCollaboratorQuerySchema.parse(req.query);
	const { data, meta } = await listCollaborators({
		page: query.page,
		limit: query.limit,
		adminView: false,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COLLABORATOR_LIST',
		message: 'SUCCESS_COLLABORATOR_LIST',
		ns: 'collaborators',
		data,
		meta,
	});
});

export const collaboratorListAdminController = asyncHandler(async (req, res) => {
	const query = ListCollaboratorQuerySchema.parse(req.query);
	const { data, meta } = await listCollaborators({
		page: query.page,
		limit: query.limit,
		adminView: true,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COLLABORATOR_LIST',
		message: 'SUCCESS_COLLABORATOR_LIST',
		ns: 'collaborators',
		data,
		meta,
	});
});
