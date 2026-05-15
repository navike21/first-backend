import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyAccess: vi.fn() },
}));
vi.mock('@Modules/team/application/createTeamMember', () => ({
	createTeamMember: vi.fn(),
}));
vi.mock('@Modules/team/application/listTeamMembers', () => ({
	listTeamMembers: vi.fn(),
}));
vi.mock('@Modules/team/application/getTeamMemberById', () => ({
	getTeamMemberById: vi.fn(),
}));
vi.mock('@Modules/team/application/updateTeamMember', () => ({
	updateTeamMember: vi.fn(),
}));
vi.mock('@Modules/team/application/deleteTeamMember', () => ({
	deleteTeamMember: vi.fn(),
}));

import { Router } from 'express';
import { teamApi } from '@Modules/team/routes/route';

describe('teamApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => teamApi(router)).not.toThrow();
	});
});
