import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/storage/infrastructure/StorageFileModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listStorageFiles } from '@Modules/storage/application/listStorageFiles';
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
	_id: 'mongo1',
};

describe('listStorageFiles', () => {
	it('returns paginated files with default page and limit', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(1);

		const result = await listStorageFiles({});

		expect(result.items).toHaveLength(1);
		expect(result.items[0]).not.toHaveProperty('_id');
		expect(result.meta.page).toBe(1);
		expect(result.meta.limit).toBe(20);
		expect(result.meta.total).toBe(1);
	});

	it('applies status filter when provided', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(1);

		await listStorageFiles({ status: 'active' });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ status: 'active' }),
		);
	});

	it('applies entityType and entityId filters', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(0);

		await listStorageFiles({ entityType: 'user', entityId: 'u-1' });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ entityType: 'user', entityId: 'u-1' }),
		);
	});

	it('applies uploadedBy filter', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(0);

		await listStorageFiles({ uploadedBy: 'user-abc' });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ uploadedBy: 'user-abc' }),
		);
	});

	it('filters by kind=image via isImage', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(1);

		await listStorageFiles({ kind: 'image' });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ isImage: true }),
		);
	});

	it('filters by kind=video via mimeType $in', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(0);

		await listStorageFiles({ kind: 'video' });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ mimeType: { $in: ['video/mp4', 'video/webm'] } }),
		);
	});

	it('applies a case-insensitive search on originalName', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(0);

		await listStorageFiles({ search: 'logo' });

		expect(StorageFileModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ originalName: { $regex: 'logo', $options: 'i' } }),
		);
	});

	it('respects custom page and limit', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.countDocuments).mockResolvedValue(50);

		const result = await listStorageFiles({ page: 3, limit: 5 });

		expect(result.meta.page).toBe(3);
		expect(result.meta.limit).toBe(5);
		expect(result.meta.totalPages).toBe(10);
	});
});
