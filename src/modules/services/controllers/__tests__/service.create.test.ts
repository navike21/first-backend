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
vi.mock('@Modules/services/application/createService', () => ({
	createService: vi.fn(),
}));

import { serviceCreateController } from '@Modules/services/controllers/service.create';
import { createService } from '@Modules/services/application/createService';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

const ls = {
	en: 'a',
	es: 'b',
	de: 'c',
	fr: 'd',
	it: 'e',
	ja: 'f',
	ko: 'g',
	pt: 'h',
	ru: 'i',
	zh: 'j',
};
const validBody = { name: ls, shortDescription: ls, description: ls };

describe('serviceCreateController', () => {
	it('calls createService and returns 201', async () => {
		vi.mocked(createService).mockResolvedValue({
			data: { id: '1', slug: 'svc' },
			warnings: [],
		} as never);
		const req = { body: validBody } as unknown as Request;
		const res = makeRes();
		await serviceCreateController(req, res, vi.fn());
		expect(createService).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await serviceCreateController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
