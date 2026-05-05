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
vi.mock('@Modules/subscribers/application/listAllSubscribers', () => ({
	listAllSubscribers: vi.fn(),
}));

import { subscriberListAll } from '@Modules/subscribers/controllers/subscriber.listAll';
import { listAllSubscribers } from '@Modules/subscribers/application/listAllSubscribers';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('subscriberListAll', () => {
	it('calls listAllSubscribers with pagination params', async () => {
		vi.mocked(listAllSubscribers).mockResolvedValue({
			data: [],
			meta: {},
		} as never);
		const req = {
			query: { limit: '5', page: '2', status: 'active' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberListAll(req, res, next);
		expect(listAllSubscribers).toHaveBeenCalledWith({
			limit: 5,
			page: 2,
			status: 'active',
		});
		expect(successResponse).toHaveBeenCalled();
	});

	it('uses defaults when query params are absent', async () => {
		vi.mocked(listAllSubscribers).mockResolvedValue({
			data: [],
			meta: {},
		} as never);
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberListAll(req, res, next);
		expect(listAllSubscribers).toHaveBeenCalledWith({
			limit: 10,
			page: 1,
			status: undefined,
		});
	});
});
