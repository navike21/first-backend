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
vi.mock('@Modules/services/application/updateService', () => ({ updateService: vi.fn() }));

import { serviceUpdateController } from '@Modules/services/controllers/service.update';
import { updateService } from '@Modules/services/application/updateService';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('serviceUpdateController', () => {
	it('calls updateService and returns 200', async () => {
		vi.mocked(updateService).mockResolvedValue({ id: '1', isActive: false } as never);
		const req = { params: { id: '1' }, body: { isActive: false } } as unknown as Request;
		await serviceUpdateController(req, makeRes(), vi.fn());
		expect(updateService).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { params: { id: '1' }, body: { slug: 'Invalid Slug!' } } as unknown as Request;
		const next = vi.fn();
		await serviceUpdateController(req, makeRes(), next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
