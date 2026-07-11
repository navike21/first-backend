import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/storage/infrastructure/StorageFileModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listDeletedStorageFiles } from '@Modules/storage/application/listDeletedStorageFiles';
import StorageFileModel from '@Modules/storage/infrastructure/StorageFileModel';

const mockQueryBuilder = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

const file = {
	id: '1',
	original: { url: 'https://cdn.example.com/f.jpg' },
	deletedAt: new Date(),
	_id: 'mongo1',
};

describe('listDeletedStorageFiles', () => {
	it('returns paginated deleted files, filtered by deletedAt != null', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(1);

		const result = await listDeletedStorageFiles({ page: 1, limit: 20 });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ deletedAt: { $ne: null } }),
		);
		expect(result.items).toHaveLength(1);
		expect(result.items[0]).not.toHaveProperty('_id');
		expect(result.meta).toEqual({ total: 1, page: 1, limit: 20, totalPages: 1 });
	});

	it('filters by kind=image via isImage', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(1);

		await listDeletedStorageFiles({ page: 1, limit: 20, kind: 'image' });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ deletedAt: { $ne: null }, isImage: true }),
		);
	});

	it('filters by kind=video via mimeType $in', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(0);

		await listDeletedStorageFiles({ page: 1, limit: 20, kind: 'video' });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ mimeType: { $in: ['video/mp4', 'video/webm'] } }),
		);
	});

	it('applies a case-insensitive search on originalName', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(0);

		await listDeletedStorageFiles({ page: 1, limit: 20, search: 'logo' });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ originalName: { $regex: 'logo', $options: 'i' } }),
		);
	});
});
