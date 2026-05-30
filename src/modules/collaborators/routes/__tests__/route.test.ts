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
vi.mock('@Modules/collaborators/application/createCollaborator', () => ({
	createCollaborator: vi.fn(),
}));
vi.mock('@Modules/collaborators/application/listCollaborators', () => ({
	listCollaborators: vi.fn(),
}));
vi.mock('@Modules/collaborators/application/getCollaboratorById', () => ({
	getCollaboratorById: vi.fn(),
}));
vi.mock('@Modules/collaborators/application/updateCollaborator', () => ({
	updateCollaborator: vi.fn(),
}));
vi.mock('@Modules/collaborators/application/deleteCollaborator', () => ({
	deleteCollaborator: vi.fn(),
}));

import { Router } from 'express';
import { collaboratorsApi } from '@Modules/collaborators/routes/route';

describe('collaboratorsApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => collaboratorsApi(router)).not.toThrow();
	});
});
