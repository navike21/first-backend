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
vi.mock('@Modules/ecommerce-settings/application/getEcommerceSettings', () => ({
	getEcommerceSettings: vi.fn(),
	clearEcommerceSettingsCache: vi.fn(),
}));
vi.mock(
	'@Modules/ecommerce-settings/application/updateEcommerceSettings',
	() => ({
		updateEcommerceSettings: vi.fn(),
	}),
);

import { Router } from 'express';
import { ecommerceSettingsApi } from '@Modules/ecommerce-settings/routes/route';

describe('ecommerceSettingsApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => ecommerceSettingsApi(router)).not.toThrow();
	});
});
