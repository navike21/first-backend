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
vi.mock('@Modules/clients/application/updateClient', () => ({
	updateClient: vi.fn(),
}));

import { clientUpdateController } from '@Modules/clients/controllers/client.update';
import { updateClient } from '@Modules/clients/application/updateClient';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('clientUpdateController', () => {
	it('calls updateClient and returns 200 on valid input', async () => {
		vi.mocked(updateClient).mockResolvedValue({
			data: { id: '1', businessName: 'New' },
			warnings: [],
		} as never);
		const req = {
			params: { id: '1' },
			body: { businessName: 'New Name' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await clientUpdateController(req, res, next);

		expect(updateClient).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = {
			params: { id: '1' },
			body: { country: 'TOOLONG' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await clientUpdateController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
