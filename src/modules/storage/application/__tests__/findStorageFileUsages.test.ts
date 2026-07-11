import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/clients/infrastructure/ClientModel', () => ({
	default: { find: vi.fn() },
}));
vi.mock('@Modules/users/infrastructure/UserModel', () => ({
	default: { find: vi.fn() },
}));
vi.mock('@Modules/collaborators/infrastructure/CollaboratorModel', () => ({
	default: { find: vi.fn() },
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { find: vi.fn() },
}));
vi.mock('@Modules/services/infrastructure/ServiceModel', () => ({
	default: { find: vi.fn() },
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { find: vi.fn() },
}));
vi.mock('@Modules/app-settings/infrastructure/AppSettingsModel', () => ({
	default: { findOne: vi.fn() },
}));

import { findStorageFileUsages } from '../findStorageFileUsages';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import UserModel from '@Modules/users/infrastructure/UserModel';
import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import AppSettingsModel from '@Modules/app-settings/infrastructure/AppSettingsModel';

function selectLean(result: unknown) {
	return { select: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue(result) } as never;
}

const URL = 'https://cdn.example.com/f.webp';

describe('findStorageFileUsages', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(ClientModel.find).mockReturnValue(selectLean([]));
		vi.mocked(UserModel.find).mockReturnValue(selectLean([]));
		vi.mocked(CollaboratorModel.find).mockReturnValue(selectLean([]));
		vi.mocked(PortfolioModel.find).mockReturnValue(selectLean([]));
		vi.mocked(ServiceModel.find).mockReturnValue(selectLean([]));
		vi.mocked(PageModel.find).mockReturnValue(selectLean([]));
		vi.mocked(AppSettingsModel.findOne).mockReturnValue(selectLean(null));
	});

	it('returns an empty list when nothing references the url', async () => {
		const result = await findStorageFileUsages(URL);
		expect(result).toEqual([]);
	});

	it('reports a client match', async () => {
		vi.mocked(ClientModel.find).mockReturnValue(selectLean([{ id: 'c1', businessName: 'Acme' }]));
		const result = await findStorageFileUsages(URL);
		expect(result).toEqual([{ module: 'clients', id: 'c1', label: 'Acme' }]);
	});

	it('reports a user match, falling back to email when name is blank', async () => {
		vi.mocked(UserModel.find).mockReturnValue(
			selectLean([{ id: 'u1', firstName: '', lastName: '', email: 'a@b.com' }]),
		);
		const result = await findStorageFileUsages(URL);
		expect(result).toEqual([{ module: 'users', id: 'u1', label: 'a@b.com' }]);
	});

	it('reports a collaborator match', async () => {
		vi.mocked(CollaboratorModel.find).mockReturnValue(selectLean([{ id: 'co1', name: 'Jane' }]));
		const result = await findStorageFileUsages(URL);
		expect(result).toEqual([{ module: 'collaborators', id: 'co1', label: 'Jane' }]);
	});

	it('reports a portfolio match, distinguishing cover from gallery', async () => {
		vi.mocked(PortfolioModel.find).mockReturnValue(
			selectLean([
				{ id: 'p1', name: { es: 'Proyecto' }, coverImageUrl: URL },
				{ id: 'p2', name: { es: 'Otro' }, coverImageUrl: 'other.webp' },
			]),
		);
		const result = await findStorageFileUsages(URL);
		expect(result).toEqual([
			{ module: 'portfolio', id: 'p1', label: 'Proyecto', context: 'cover' },
			{ module: 'portfolio', id: 'p2', label: 'Otro', context: 'gallery' },
		]);
	});

	it('reports a service match using the localized name with en fallback', async () => {
		vi.mocked(ServiceModel.find).mockReturnValue(
			selectLean([{ id: 's1', name: { es: '', en: 'Consulting' } }]),
		);
		const result = await findStorageFileUsages(URL);
		expect(result).toEqual([{ module: 'services', id: 's1', label: 'Consulting' }]);
	});

	it('reports a page match and infers cover/ogImage/background context', async () => {
		vi.mocked(PageModel.find).mockReturnValue(
			selectLean([
				{ id: 'pg1', title: { es: 'Inicio' }, coverImageUrl: URL, seo: {} },
				{ id: 'pg2', title: { es: 'SEO' }, coverImageUrl: 'x', seo: { ogImage: URL } },
				{ id: 'pg3', title: { es: 'Fondo' }, coverImageUrl: 'x', seo: {} },
			]),
		);
		const result = await findStorageFileUsages(URL);
		expect(result).toEqual([
			{ module: 'pages', id: 'pg1', label: 'Inicio', context: 'cover' },
			{ module: 'pages', id: 'pg2', label: 'SEO', context: 'ogImage' },
			{ module: 'pages', id: 'pg3', label: 'Fondo', context: 'background' },
		]);
	});

	it('reports app-settings logo/favicon matches', async () => {
		vi.mocked(AppSettingsModel.findOne).mockReturnValue(
			selectLean({ appearance: { logoUrl: URL, faviconUrl: URL } }),
		);
		const result = await findStorageFileUsages(URL);
		expect(result).toEqual([
			{ module: 'app-settings', id: 'singleton', label: '', context: 'logo' },
			{ module: 'app-settings', id: 'singleton', label: '', context: 'favicon' },
		]);
	});
});
