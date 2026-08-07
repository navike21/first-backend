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
vi.mock('@Modules/payments/application/listPaymentProviderConfigs', () => ({
	listPaymentProviderConfigs: vi.fn(),
}));
vi.mock('@Modules/payments/application/upsertPaymentProviderConfig', () => ({
	upsertPaymentProviderConfig: vi.fn(),
}));
vi.mock('@Modules/payments/application/createPaymentMethod', () => ({
	createPaymentMethod: vi.fn(),
}));
vi.mock('@Modules/payments/application/updatePaymentMethod', () => ({
	updatePaymentMethod: vi.fn(),
}));
vi.mock('@Modules/payments/application/deletePaymentMethodLogical', () => ({
	deletePaymentMethodLogical: vi.fn(),
}));
vi.mock('@Modules/payments/application/deletePaymentMethodPhysical', () => ({
	deletePaymentMethodPhysical: vi.fn(),
}));
vi.mock('@Modules/payments/application/restorePaymentMethod', () => ({
	restorePaymentMethod: vi.fn(),
}));
vi.mock('@Modules/payments/application/getPaymentMethodById', () => ({
	getPaymentMethodById: vi.fn(),
}));
vi.mock('@Modules/payments/application/listPaymentMethods', () => ({
	listPaymentMethods: vi.fn(),
}));
vi.mock('@Modules/payments/application/listDeletedPaymentMethods', () => ({
	listDeletedPaymentMethods: vi.fn(),
}));
vi.mock('@Modules/payments/application/deletePaymentMethodsBulk', () => ({
	deletePaymentMethodsBulk: vi.fn(),
}));
vi.mock('@Modules/payments/application/restorePaymentMethodsBulk', () => ({
	restorePaymentMethodsBulk: vi.fn(),
}));
vi.mock('@Modules/payments/application/purgePaymentMethodsBulk', () => ({
	purgePaymentMethodsBulk: vi.fn(),
}));

import { Router } from 'express';
import { paymentsApi } from '@Modules/payments/routes/route';

describe('paymentsApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => paymentsApi(router)).not.toThrow();
	});
});
