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
vi.mock('@Modules/services/application/getServiceBySlug', () => ({
	getServiceBySlug: vi.fn(),
}));

import { serviceGetBySlugController } from '@Modules/services/controllers/service.getBySlug';
import { getServiceBySlug } from '@Modules/services/application/getServiceBySlug';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('serviceGetBySlugController', () => {
	it('calls getServiceBySlug and returns 200', async () => {
		vi.mocked(getServiceBySlug).mockResolvedValue({
			id: '1',
			slug: 'web',
		} as never);
		const req = { params: { slug: 'web' } } as unknown as Request;
		await serviceGetBySlugController(req, makeRes(), vi.fn());
		expect(getServiceBySlug).toHaveBeenCalledWith('web');
		expect(successResponse).toHaveBeenCalled();
	});
});
