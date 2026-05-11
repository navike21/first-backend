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
vi.mock(
	'@Modules/subscribers/application/deleteSubscribersLogicalBulk',
	() => ({ deleteSubscribersLogicalBulk: vi.fn() }),
);

import { subscriberDeleteLogicalBulk } from '@Modules/subscribers/controllers/subscriber.deleteLogicalBulk';
import { deleteSubscribersLogicalBulk } from '@Modules/subscribers/application/deleteSubscribersLogicalBulk';
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

describe('subscriberDeleteLogicalBulk', () => {
	it('returns SUCCESS_SUBSCRIBERS_DELETED when all are deleted', async () => {
		vi.mocked(deleteSubscribersLogicalBulk).mockResolvedValue({
			deletedIds: [validId1],
			notFoundOrInactiveIds: [],
		} as never);
		const req = { body: { ids: [validId1] } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberDeleteLogicalBulk(req, res, next);
		expect(deleteSubscribersLogicalBulk).toHaveBeenCalledWith([validId1]);
		expect(successResponse).toHaveBeenCalled();
	});

	it('returns SUCCESS_SUBSCRIBERS_PARTIALLY_DELETED when some are not found', async () => {
		vi.mocked(deleteSubscribersLogicalBulk).mockResolvedValue({
			deletedIds: [validId1],
			notFoundOrInactiveIds: [validId2],
		} as never);
		const req = { body: { ids: [validId1, validId2] } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberDeleteLogicalBulk(req, res, next);
		expect(successResponse).toHaveBeenCalled();
	});

	it('returns SUCCESS_NO_SUBSCRIBERS_DELETED when none are deleted', async () => {
		vi.mocked(deleteSubscribersLogicalBulk).mockResolvedValue({
			deletedIds: [],
			notFoundOrInactiveIds: [validId1],
		} as never);
		const req = { body: { ids: [validId1] } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberDeleteLogicalBulk(req, res, next);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await subscriberDeleteLogicalBulk(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
