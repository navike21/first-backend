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
vi.mock('@Modules/subscribers/application/searchSubscriberById', () => ({
	searchSubscriberById: vi.fn(),
}));

import { subscriberSearchById } from '@Modules/subscribers/controllers/subscriber.subscriberSearchById';
import { searchSubscriberById } from '@Modules/subscribers/application/searchSubscriberById';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('subscriberSearchById', () => {
	it('calls searchSubscriberById with id param', async () => {
		vi.mocked(searchSubscriberById).mockResolvedValue({ id: 'abc' } as never);
		const req = { params: { id: 'abc' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberSearchById(req, res, next);
		expect(searchSubscriberById).toHaveBeenCalledWith('abc');
		expect(successResponse).toHaveBeenCalled();
	});
});
