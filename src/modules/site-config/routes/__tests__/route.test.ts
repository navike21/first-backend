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
vi.mock('@Modules/site-config/application/getSiteConfig', () => ({
	getSiteConfig: vi.fn(),
	clearSiteConfigCache: vi.fn(),
}));
vi.mock('@Modules/site-config/application/updateSiteConfig', () => ({
	updateSiteConfig: vi.fn(),
}));

import { Router } from 'express';
import { siteConfigApi } from '@Modules/site-config/routes/route';

describe('siteConfigApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => siteConfigApi(router)).not.toThrow();
	});
});
