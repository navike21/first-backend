import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { updateTeamMember } from '../application/updateTeamMember';
import { UpdateTeamMemberSchema } from '../schemas/team.schema';

export const teamUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const parsed = UpdateTeamMemberSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
		});
	}

	const data = await updateTeamMember(id, parsed.data!);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_TEAM_MEMBER_UPDATE',
		message: 'SUCCESS_TEAM_MEMBER_UPDATE',
		ns: 'team',
		data,
	});
});
