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
vi.mock('@Modules/pages/application/createPage', () => ({
	createPage: vi.fn(),
}));

import { pageCreateController } from '@Modules/pages/controllers/page.create';
import { createPage } from '@Modules/pages/application/createPage';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: { userId: 'user-1' },
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

const localizedName = {
	en: 'Home',
	es: 'Inicio',
	de: 'Start',
	fr: 'Accueil',
	it: 'Home',
	ja: 'ホーム',
	ko: '홈',
	pt: 'Início',
	ru: 'Главная',
	zh: '首页',
};

const validBody = { title: localizedName, slug: { en: 'home' } };

describe('pageCreateController', () => {
	it('calls createPage and returns 201 on valid input', async () => {
		vi.mocked(createPage).mockResolvedValue({
			data: { id: '1' },
			warnings: [],
		} as never);
		const req = { body: validBody } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageCreateController(req, res, next);

		expect(createPage).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageCreateController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
