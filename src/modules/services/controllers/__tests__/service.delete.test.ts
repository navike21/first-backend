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
vi.mock('@Modules/services/application/deleteServiceLogical', () => ({ deleteServiceLogical: vi.fn() }));

import { serviceDeleteController } from '@Modules/services/controllers/service.delete';
import { deleteServiceLogical } from '@Modules/services/application/deleteServiceLogical';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('serviceDeleteController', () => {
	it('calls deleteServiceLogical and returns 200', async () => {
		vi.mocked(deleteServiceLogical).mockResolvedValue({ id: '1', status: 'deleted' } as never);
		const req = { params: { id: '1' } } as unknown as Request;
		await serviceDeleteController(req, makeRes(), vi.fn());
		expect(deleteServiceLogical).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});
});
