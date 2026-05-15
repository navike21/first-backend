import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getTeamMemberById } from '../application/getTeamMemberById';

export const teamGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getTeamMemberById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TEAM_MEMBER_FOUND',
		message: 'SUCCESS_TEAM_MEMBER_FOUND',
		ns: 'team',
		data,
	});
});
