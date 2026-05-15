import { describe, it, expect } from 'vitest';
import { TeamMemberNotFoundError } from '@Modules/team/domain/errors/TeamErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Team domain errors', () => {
	it('TeamMemberNotFoundError has correct code and status', () => {
		const error = new TeamMemberNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('TEAM_MEMBER_NOT_FOUND');
	});
});
