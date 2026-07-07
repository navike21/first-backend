import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/storage/infrastructure/StorageFileModel', () => ({
	default: { find: vi.fn() },
}));

import { listEntityFiles } from '@Modules/storage/application/listEntityFiles';
import StorageFileModel from '@Modules/storage/infrastructure/StorageFileModel';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('listEntityFiles', () => {
	it('lists non-deleted files for the entity', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([{ id: 'f1' }]) as never,
		);

		const result = await listEntityFiles('portfolio', 'p-1');

		expect(StorageFileModel.find).toHaveBeenCalledWith({
			entityType: 'portfolio',
			entityId: 'p-1',
			deletedAt: null,
		});
		expect(result).toEqual([{ id: 'f1' }]);
	});

	it('scopes the query to a field when given', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);

		await listEntityFiles('portfolio', 'p-1', { field: 'gallery' });

		expect(StorageFileModel.find).toHaveBeenCalledWith({
			entityType: 'portfolio',
			entityId: 'p-1',
			deletedAt: null,
			field: 'gallery',
		});
	});
});
