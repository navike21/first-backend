import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteTeamMember } from '../application/deleteTeamMember';

export const teamDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteTeamMember(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TEAM_MEMBER_DELETED',
		message: 'SUCCESS_TEAM_MEMBER_DELETED',
		ns: 'team',
		data,
	});
});
