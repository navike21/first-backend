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
vi.mock('@Modules/clients/application/getClientById', () => ({
	getClientById: vi.fn(),
}));

import { clientGetByIdController } from '@Modules/clients/controllers/client.getById';
import { getClientById } from '@Modules/clients/application/getClientById';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('clientGetByIdController', () => {
	it('calls getClientById and returns 200', async () => {
		vi.mocked(getClientById).mockResolvedValue({ id: '1', businessName: 'Acme' } as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await clientGetByIdController(req, res, next);

		expect(getClientById).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});
});
