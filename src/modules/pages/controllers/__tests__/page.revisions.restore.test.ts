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
	restorePageRevision: vi.fn(),
}));

import { pageRevisionsRestoreController } from '@Modules/pages/controllers/page.revisions.restore';
import { restorePageRevision } from '@Modules/pages/application/pageRevisions';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: { userId: 'user-1' },
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageRevisionsRestoreController', () => {
	it('calls restorePageRevision and returns 200', async () => {
		vi.mocked(restorePageRevision).mockResolvedValue({ id: 'page-1' } as never);
		const req = {
			params: { id: 'page-1', revisionId: 'rev-1' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageRevisionsRestoreController(req, res, next);

		expect(restorePageRevision).toHaveBeenCalledWith(
			'page-1',
			'rev-1',
			'user-1',
		);
		expect(successResponse).toHaveBeenCalled();
	});
});
