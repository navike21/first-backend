import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { createTeamMember } from '../application/createTeamMember';
import { CreateTeamMemberSchema } from '../schemas/team.schema';

export const teamCreateController = asyncHandler(async (req, res) => {
	const parsed = CreateTeamMemberSchema.safeParse(req.body);
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

	const data = await createTeamMember(parsed.data!);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_TEAM_MEMBER_CREATE',
		message: 'SUCCESS_TEAM_MEMBER_CREATE',
		ns: 'team',
		data,
	});
});
