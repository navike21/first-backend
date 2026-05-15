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
vi.mock('@Modules/clients/application/createClient', () => ({
	createClient: vi.fn(),
}));
vi.mock('@Modules/clients/application/listClients', () => ({
	listClients: vi.fn(),
}));
vi.mock('@Modules/clients/application/getClientById', () => ({
	getClientById: vi.fn(),
}));
vi.mock('@Modules/clients/application/updateClient', () => ({
	updateClient: vi.fn(),
}));
vi.mock('@Modules/clients/application/deleteClientLogical', () => ({
	deleteClientLogical: vi.fn(),
}));

import { Router } from 'express';
import { clientsApi } from '@Modules/clients/routes/route';

describe('clientsApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => clientsApi(router)).not.toThrow();
	});
});
