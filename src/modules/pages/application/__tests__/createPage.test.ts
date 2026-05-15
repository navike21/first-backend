import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));

import { createPage } from '@Modules/pages/application/createPage';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import { PageSlugConflictError } from '@Modules/pages/domain/errors/PageErrors';

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

const validInput = {
	slug: 'home',
	title: localizedName,
	isPublished: false,
};

describe('createPage', () => {
	it('creates a page and returns cleaned data', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue(null);
		vi.mocked(PageModel.create).mockResolvedValue({
			...validInput,
			id: '550e8400-e29b-41d4-a716-446655440000',
			toObject: vi.fn().mockReturnValue({
				...validInput,
				id: '550e8400-e29b-41d4-a716-446655440000',
				_id: 'mongo-1',
			}),
		} as never);

		const result = await createPage(validInput);

		expect(PageModel.create).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws PageSlugConflictError when slug already exists', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue({ id: 'existing' } as never);

		await expect(createPage(validInput)).rejects.toThrow(PageSlugConflictError);
	});
});
