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

import { deleteStorageFilesByIds } from '@Modules/storage/application/deleteStorageFilesByIds';
import StorageFileModel from '@Modules/storage/infrastructure/StorageFileModel';

const lean = (value: unknown) => ({ lean: vi.fn().mockResolvedValue(value) });

describe('deleteStorageFilesByIds', () => {
	beforeEach(() => vi.clearAllMocks());

	it('is a no-op for an empty id list', async () => {
		await deleteStorageFilesByIds([]);
		expect(StorageFileModel.find).not.toHaveBeenCalled();
	});

	it('deletes the blobs and records for the given ids', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			lean([
				{ id: 's1', original: { url: 'https://cdn/o.jpg' }, full: { url: 'https://cdn/f.webp' } },
			]) as never,
		);
		vi.mocked(StorageFileModel.deleteMany).mockResolvedValue({} as never);
		mockDelete.mockResolvedValue(undefined);

		await deleteStorageFilesByIds(['s1']);

		expect(mockDelete).toHaveBeenCalledTimes(2);
		expect(StorageFileModel.deleteMany).toHaveBeenCalledWith({
			id: { $in: ['s1'] },
		});
	});

	it('does nothing when the ids match no records', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(lean([]) as never);

		await deleteStorageFilesByIds(['missing']);

		expect(mockDelete).not.toHaveBeenCalled();
		expect(StorageFileModel.deleteMany).not.toHaveBeenCalled();
	});
});
