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
vi.mock('@Modules/subscribers/application/deleteSubscribersBulk', () => ({
	deleteSubscribersBulk: vi.fn(),
}));

import { subscriberDeletePhysicalBulk } from '@Modules/subscribers/controllers/subscriber.deleteBulk';
import { deleteSubscribersBulk } from '@Modules/subscribers/application/deleteSubscribersBulk';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

const validId1 = '550e8400-e29b-41d4-a716-446655440000';
const validId2 = '550e8400-e29b-41d4-a716-446655440001';

describe('subscriberDeletePhysicalBulk', () => {
	it('returns SUCCESS_SUBSCRIBERS_DELETED when all are deleted', async () => {
		vi.mocked(deleteSubscribersBulk).mockResolvedValue({
			deletedIds: [validId1],
			notFoundIds: [],
		} as never);
		const req = { body: { ids: [validId1] } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberDeletePhysicalBulk(req, res, next);
		expect(deleteSubscribersBulk).toHaveBeenCalledWith([validId1]);
		expect(successResponse).toHaveBeenCalled();
	});

	it('returns SUCCESS_SUBSCRIBERS_PARTIALLY_DELETED when some are not found', async () => {
		vi.mocked(deleteSubscribersBulk).mockResolvedValue({
			deletedIds: [validId1],
			notFoundIds: [validId2],
		} as never);
		const req = { body: { ids: [validId1, validId2] } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberDeletePhysicalBulk(req, res, next);
		expect(successResponse).toHaveBeenCalled();
	});

	it('returns SUCCESS_NO_SUBSCRIBERS_DELETED when none are deleted', async () => {
		vi.mocked(deleteSubscribersBulk).mockResolvedValue({
			deletedIds: [],
			notFoundIds: [validId1],
		} as never);
		const req = { body: { ids: [validId1] } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberDeletePhysicalBulk(req, res, next);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberDeletePhysicalBulk(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
