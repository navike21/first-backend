import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/services/application/listServicesAdmin', () => ({
	listServicesAdmin: vi.fn(),
}));

import { serviceListAdminController } from '@Modules/services/controllers/service.listAdmin';
import { listServicesAdmin } from '@Modules/services/application/listServicesAdmin';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('serviceListAdminController', () => {
	it('calls listServicesAdmin and returns 200', async () => {
		vi.mocked(listServicesAdmin).mockResolvedValue({
			data: [],
			meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
		});
		const req = { query: {} } as unknown as Request;
		await serviceListAdminController(req, makeRes(), vi.fn());
		expect(listServicesAdmin).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});
});
