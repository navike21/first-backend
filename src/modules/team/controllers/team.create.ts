import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { createTeamMember } from '../application/createTeamMember';
import { CreateTeamMemberSchema } from '../schemas/team.schema';

export const teamCreateController = asyncHandler(async (req, res) => {
	const parsed = CreateTeamMemberSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await createTeamMember(parsed.data);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_TEAM_MEMBER_CREATE',
		message: 'SUCCESS_TEAM_MEMBER_CREATE',
		ns: 'team',
		data,
	});
});
