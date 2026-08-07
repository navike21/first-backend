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
vi.mock('@Modules/shipping/application/createShippingRule', () => ({
	createShippingRule: vi.fn(),
}));
vi.mock('@Modules/shipping/application/updateShippingRule', () => ({
	updateShippingRule: vi.fn(),
}));
vi.mock('@Modules/shipping/application/deleteShippingRuleLogical', () => ({
	deleteShippingRuleLogical: vi.fn(),
}));
vi.mock('@Modules/shipping/application/deleteShippingRulePhysical', () => ({
	deleteShippingRulePhysical: vi.fn(),
}));
vi.mock('@Modules/shipping/application/restoreShippingRule', () => ({
	restoreShippingRule: vi.fn(),
}));
vi.mock('@Modules/shipping/application/getShippingRuleById', () => ({
	getShippingRuleById: vi.fn(),
}));
vi.mock('@Modules/shipping/application/listShippingRules', () => ({
	listShippingRules: vi.fn(),
}));
vi.mock('@Modules/shipping/application/listDeletedShippingRules', () => ({
	listDeletedShippingRules: vi.fn(),
}));
vi.mock('@Modules/shipping/application/deleteShippingRulesBulk', () => ({
	deleteShippingRulesBulk: vi.fn(),
}));
vi.mock('@Modules/shipping/application/restoreShippingRulesBulk', () => ({
	restoreShippingRulesBulk: vi.fn(),
}));
vi.mock('@Modules/shipping/application/purgeShippingRulesBulk', () => ({
	purgeShippingRulesBulk: vi.fn(),
}));

import { Router } from 'express';
import { shippingApi } from '@Modules/shipping/routes/route';

describe('shippingApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => shippingApi(router)).not.toThrow();
	});
});
