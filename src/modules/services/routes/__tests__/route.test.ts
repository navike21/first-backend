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
vi.mock('@Modules/services/application/createService', () => ({ createService: vi.fn() }));
vi.mock('@Modules/services/application/listServicesPublic', () => ({ listServicesPublic: vi.fn() }));
vi.mock('@Modules/services/application/listServicesAdmin', () => ({ listServicesAdmin: vi.fn() }));
vi.mock('@Modules/services/application/getServiceBySlug', () => ({ getServiceBySlug: vi.fn() }));
vi.mock('@Modules/services/application/updateService', () => ({ updateService: vi.fn() }));
vi.mock('@Modules/services/application/deleteServiceLogical', () => ({ deleteServiceLogical: vi.fn() }));

import { Router } from 'express';
import { servicesApi } from '@Modules/services/routes/route';

describe('servicesApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => servicesApi(router)).not.toThrow();
	});
});
