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
vi.mock('@Modules/clients/application/deleteClientLogical', () => ({
	deleteClientLogical: vi.fn(),
}));

import { clientDeleteController } from '@Modules/clients/controllers/client.delete';
import { deleteClientLogical } from '@Modules/clients/application/deleteClientLogical';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('clientDeleteController', () => {
	it('calls deleteClientLogical and returns 200', async () => {
		vi.mocked(deleteClientLogical).mockResolvedValue({ id: '1', status: 'deleted' } as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await clientDeleteController(req, res, next);

		expect(deleteClientLogical).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});
});
