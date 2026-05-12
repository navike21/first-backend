import { AppError } from '@Shared/domain/AppError';

export class TeamMemberNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'TEAM_MEMBER_NOT_FOUND',
			message: 'TEAM_MEMBER_NOT_FOUND',
			ns: 'team',
		});
	}
}
