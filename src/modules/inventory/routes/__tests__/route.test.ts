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
vi.mock('@Modules/inventory/application/createLocation', () => ({
	createLocation: vi.fn(),
}));
vi.mock('@Modules/inventory/application/updateLocation', () => ({
	updateLocation: vi.fn(),
}));
vi.mock('@Modules/inventory/application/getLocationById', () => ({
	getLocationById: vi.fn(),
}));
vi.mock('@Modules/inventory/application/listLocations', () => ({
	listLocations: vi.fn(),
}));
vi.mock('@Modules/inventory/application/deleteLocationLogical', () => ({
	deleteLocationLogical: vi.fn(),
}));
vi.mock('@Modules/inventory/application/deleteLocationPhysical', () => ({
	deleteLocationPhysical: vi.fn(),
}));
vi.mock('@Modules/inventory/application/restoreLocation', () => ({
	restoreLocation: vi.fn(),
}));
vi.mock('@Modules/inventory/application/listDeletedLocations', () => ({
	listDeletedLocations: vi.fn(),
}));
vi.mock('@Modules/inventory/application/deleteLocationsBulk', () => ({
	deleteLocationsBulk: vi.fn(),
}));
vi.mock('@Modules/inventory/application/restoreLocationsBulk', () => ({
	restoreLocationsBulk: vi.fn(),
}));
vi.mock('@Modules/inventory/application/purgeLocationsBulk', () => ({
	purgeLocationsBulk: vi.fn(),
}));
vi.mock('@Modules/inventory/application/adjustStock', () => ({
	adjustStock: vi.fn(),
}));
vi.mock('@Modules/inventory/application/getStockByProduct', () => ({
	getStockByProduct: vi.fn(),
}));

import { Router } from 'express';
import { inventoryApi } from '@Modules/inventory/routes/route';

describe('inventoryApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => inventoryApi(router)).not.toThrow();
	});
});
