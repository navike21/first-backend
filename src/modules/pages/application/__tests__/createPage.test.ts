import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock('@Modules/pages/infrastructure/PageRevisionModel', () => ({
	default: { create: vi.fn().mockResolvedValue({}) },
}));
vi.mock('@Modules/storage', () => ({
	uploadImageSafe: vi.fn(),
	deleteEntityFiles: vi.fn().mockResolvedValue(undefined),
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
	title: localizedName,
	slug: { en: 'home', es: 'inicio' },
	status: 'draft' as const,
	categoryIds: [],
	tagIds: [],
};

describe('createPage', () => {
	it('creates a page and returns cleaned data', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue(null as never);
		vi.mocked(PageModel.create).mockResolvedValue({
			...validInput,
			id: '550e8400-e29b-41d4-a716-446655440000',
			toObject: vi.fn().mockReturnValue({
				...validInput,
				id: '550e8400-e29b-41d4-a716-446655440000',
				_id: 'mongo-1',
			}),
		} as never);

		const result = await createPage(validInput, undefined, 'user-1');

		expect(PageModel.create).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
	});

	it('throws PageSlugConflictError when a sibling with the same slug already exists', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue({ id: 'existing' } as never);

		await expect(createPage(validInput, undefined, 'user-1')).rejects.toThrow(
			PageSlugConflictError,
		);
	});
});
