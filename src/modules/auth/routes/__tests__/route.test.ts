import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/auth/application/loginUser', () => ({ loginUser: vi.fn() }));
vi.mock('@Modules/auth/application/logoutUser', () => ({
	logoutUser: vi.fn(),
}));
vi.mock('@Modules/auth/application/refreshToken', () => ({
	rotateRefreshToken: vi.fn(),
}));
vi.mock('@Modules/auth/application/verifyEmail', () => ({
	verifyEmail: vi.fn(),
}));
vi.mock('@Modules/auth/application/forgotPassword', () => ({
	forgotPassword: vi.fn(),
}));
vi.mock('@Modules/auth/application/resetPassword', () => ({
	resetPassword: vi.fn(),
}));
vi.mock('@Modules/auth/application/changePassword', () => ({
	changePassword: vi.fn(),
}));
vi.mock('@Modules/auth/application/getActiveSessions', () => ({
	getActiveSessions: vi.fn(),
}));
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyAccess: vi.fn() },
}));

import { Router } from 'express';
import { authApi } from '@Modules/auth/routes/route';

describe('authApi route', () => {
	it('registers routes on the router', () => {
		const router = Router();
		expect(() => authApi(router)).not.toThrow();
	});
});
