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
vi.mock('@Modules/subscribers/application/deleteSubscriber', () => ({
	deleteSubscriber: vi.fn(),
}));

import { subscriberDeletePhysical } from '@Modules/subscribers/controllers/subscriber.delete';
import { deleteSubscriber } from '@Modules/subscribers/application/deleteSubscriber';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('subscriberDeletePhysical', () => {
	it('calls deleteSubscriber and returns success', async () => {
		vi.mocked(deleteSubscriber).mockResolvedValue({ id: '1' } as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberDeletePhysical(req, res, next);
		expect(deleteSubscriber).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});
});
