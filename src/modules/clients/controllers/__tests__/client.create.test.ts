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
vi.mock('@Modules/clients/application/createClient', () => ({
	createClient: vi.fn(),
}));

import { clientCreateController } from '@Modules/clients/controllers/client.create';
import { createClient } from '@Modules/clients/application/createClient';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

const validBody = {
	businessName: 'Acme',
	clientType: 'company',
	country: 'PE',
};

describe('clientCreateController', () => {
	it('calls createClient and returns 201 on valid input', async () => {
		vi.mocked(createClient).mockResolvedValue({
			id: '1',
			businessName: 'Acme',
		} as never);
		const req = { body: validBody } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await clientCreateController(req, res, next);

		expect(createClient).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await clientCreateController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
