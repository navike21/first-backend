import { describe, it, expect, vi } from 'vitest';

const mockDelete = vi.fn();

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test', STORAGE_DRIVER: 'vercel-blob' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/storage/infrastructure/StorageFileModel', () => ({
	default: { find: vi.fn(), deleteMany: vi.fn() },
}));
vi.mock('@Modules/storage/infrastructure/StorageService', () => ({
	getStorageDriver: vi.fn(() => ({
		delete: mockDelete,
		uploadBuffer: vi.fn(),
	})),
}));

import { deleteFilesPermanent } from '@Modules/storage/application/deleteFilesPermanent';
import StorageFileModel from '@Modules/storage/infrastructure/StorageFileModel';

const VALID_ID = '550e8400-e29b-41d4-a716-446655440000';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('deleteFilesPermanent', () => {
	it('deletes files from storage and database', async () => {
		const file = {
			id: VALID_ID,
			original: { url: 'https://cdn.example.com/f.jpg' },
			full: { url: 'https://cdn.example.com/f-full.webp' },
			thumb: { url: 'https://cdn.example.com/f-thumb.webp' },
		};
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.deleteMany).mockResolvedValue({} as never);
		mockDelete.mockResolvedValue(undefined);

		await deleteFilesPermanent([VALID_ID]);

		expect(mockDelete).toHaveBeenCalledTimes(3);
		expect(StorageFileModel.deleteMany).toHaveBeenCalled();
	});

	it('throws when no files found', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);

		await expect(deleteFilesPermanent([VALID_ID])).rejects.toThrow();
	});

	it('skips optional full/thumb urls when absent', async () => {
		const file = {
			id: VALID_ID,
			original: { url: 'https://cdn.example.com/f.jpg' },
		};
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.deleteMany).mockResolvedValue({} as never);
		mockDelete.mockResolvedValue(undefined);

		await deleteFilesPermanent([VALID_ID]);

		expect(mockDelete).toHaveBeenCalledTimes(1);
	});
});
