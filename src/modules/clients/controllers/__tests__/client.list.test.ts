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
vi.mock('@Modules/clients/application/listClients', () => ({
	listClients: vi.fn(),
}));

import { clientListController } from '@Modules/clients/controllers/client.list';
import { listClients } from '@Modules/clients/application/listClients';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('clientListController', () => {
	it('calls listClients and returns 200', async () => {
		vi.mocked(listClients).mockResolvedValue({
			data: [],
			meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
		});
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await clientListController(req, res, next);

		expect(listClients).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});
});
