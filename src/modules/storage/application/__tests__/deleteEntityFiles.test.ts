import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDelete = vi.fn();

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test', STORAGE_DRIVER: 'vercel-blob' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/storage/infrastructure/StorageFileModel', () => ({
	default: { find: vi.fn(), deleteMany: vi.fn() },
}));
vi.mock('@Modules/storage/infrastructure/StorageService', () => ({
	getStorageDriver: vi.fn(() => ({ delete: mockDelete, uploadBuffer: vi.fn() })),
}));
vi.mock('@Helpers/log', () => ({ logError: vi.fn() }));

import { deleteEntityFiles } from '@Modules/storage/application/deleteEntityFiles';
import StorageFileModel from '@Modules/storage/infrastructure/StorageFileModel';
import { logError } from '@Helpers/log';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('deleteEntityFiles', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('deletes every variant blob and the records for the entity', async () => {
		const file = {
			id: 'f1',
			original: { url: 'https://cdn/o.jpg' },
			full: { url: 'https://cdn/full.webp' },
			thumb: { url: 'https://cdn/thumb.webp' },
		};
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.deleteMany).mockResolvedValue({} as never);
		mockDelete.mockResolvedValue(undefined);

		await deleteEntityFiles('clients', 'client-1');

		expect(mockDelete).toHaveBeenCalledTimes(3);
		expect(StorageFileModel.deleteMany).toHaveBeenCalledWith({
			entityType: 'clients',
			entityId: 'client-1',
		});
	});

	it('excludes the kept storage ids when exceptStorageIds is given', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([
				{ id: 'old', original: { url: 'https://cdn/old.jpg' } },
			]) as never,
		);
		vi.mocked(StorageFileModel.deleteMany).mockResolvedValue({} as never);
		mockDelete.mockResolvedValue(undefined);

		await deleteEntityFiles('clients', 'client-1', {
			exceptStorageIds: ['new'],
		});

		const expectedFilter = {
			entityType: 'clients',
			entityId: 'client-1',
			id: { $nin: ['new'] },
		};
		expect(StorageFileModel.find).toHaveBeenCalledWith(expectedFilter);
		expect(StorageFileModel.deleteMany).toHaveBeenCalledWith(expectedFilter);
	});

	it('scopes the filter to a field, leaving other fields untouched', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([
				{ id: 'gal-1', original: { url: 'https://cdn/gal-1.jpg' } },
			]) as never,
		);
		vi.mocked(StorageFileModel.deleteMany).mockResolvedValue({} as never);
		mockDelete.mockResolvedValue(undefined);

		await deleteEntityFiles('portfolio', 'p-1', {
			field: 'gallery',
			exceptStorageIds: ['gal-2'],
		});

		const expectedFilter = {
			entityType: 'portfolio',
			entityId: 'p-1',
			field: 'gallery',
			id: { $nin: ['gal-2'] },
		};
		expect(StorageFileModel.find).toHaveBeenCalledWith(expectedFilter);
		expect(StorageFileModel.deleteMany).toHaveBeenCalledWith(expectedFilter);
	});

	it('is a no-op when the entity has no files', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);

		await deleteEntityFiles('clients', 'client-x');

		expect(mockDelete).not.toHaveBeenCalled();
		expect(StorageFileModel.deleteMany).not.toHaveBeenCalled();
	});

	it('still removes the records when a blob deletion fails (resilient)', async () => {
		const file = { id: 'f1', original: { url: 'https://cdn/o.jpg' } };
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.deleteMany).mockResolvedValue({} as never);
		mockDelete.mockRejectedValue(new Error('blob gone'));

		await deleteEntityFiles('clients', 'client-1');

		expect(logError).toHaveBeenCalled();
		expect(StorageFileModel.deleteMany).toHaveBeenCalled();
	});
});
