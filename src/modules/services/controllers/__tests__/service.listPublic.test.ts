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
vi.mock('@Modules/services/application/listServicesPublic', () => ({
	listServicesPublic: vi.fn(),
}));

import { serviceListPublicController } from '@Modules/services/controllers/service.listPublic';
import { listServicesPublic } from '@Modules/services/application/listServicesPublic';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('serviceListPublicController', () => {
	it('calls listServicesPublic and returns 200', async () => {
		vi.mocked(listServicesPublic).mockResolvedValue({
			data: [],
			meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
		});
		const req = { query: {} } as unknown as Request;
		await serviceListPublicController(req, makeRes(), vi.fn());
		expect(listServicesPublic).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});
});
