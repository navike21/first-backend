import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listTeamMembers } from '../application/listTeamMembers';
import { ListTeamQuerySchema } from '../schemas/team.schema';

export const teamListPublicController = asyncHandler(async (req, res) => {
	const query = ListTeamQuerySchema.parse(req.query);
	const { data, meta } = await listTeamMembers({
		page: query.page,
		limit: query.limit,
		adminView: false,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TEAM_MEMBER_LIST',
		message: 'SUCCESS_TEAM_MEMBER_LIST',
		ns: 'team',
		data,
		meta,
	});
});

export const teamListAdminController = asyncHandler(async (req, res) => {
	const query = ListTeamQuerySchema.parse(req.query);
	const { data, meta } = await listTeamMembers({
		page: query.page,
		limit: query.limit,
		adminView: true,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TEAM_MEMBER_LIST',
		message: 'SUCCESS_TEAM_MEMBER_LIST',
		ns: 'team',
		data,
		meta,
	});
});
