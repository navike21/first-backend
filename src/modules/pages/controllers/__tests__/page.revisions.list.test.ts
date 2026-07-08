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
vi.mock('@Modules/pages/application/pageRevisions', () => ({
	listPageRevisions: vi.fn(),
}));

import { pageRevisionsListController } from '@Modules/pages/controllers/page.revisions.list';
import { listPageRevisions } from '@Modules/pages/application/pageRevisions';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageRevisionsListController', () => {
	it('calls listPageRevisions and returns 200', async () => {
		vi.mocked(listPageRevisions).mockResolvedValue([{ id: 'rev-1' }] as never);
		const req = { params: { id: 'page-1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageRevisionsListController(req, res, next);

		expect(listPageRevisions).toHaveBeenCalledWith('page-1');
		expect(successResponse).toHaveBeenCalled();
	});
});
