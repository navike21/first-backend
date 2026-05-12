import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/storage/infrastructure/StorageFileModel', () => ({
	default: { find: vi.fn(), updateMany: vi.fn() },
}));

import { deleteFilesLogical } from '@Modules/storage/application/deleteFilesLogical';
import StorageFileModel from '@Modules/storage/infrastructure/StorageFileModel';

const VALID_ID = '550e8400-e29b-41d4-a716-446655440000';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('deleteFilesLogical', () => {
	it('soft-deletes files and returns cleaned data', async () => {
		const file = {
			id: VALID_ID,
			original: { url: 'https://cdn.example.com/f.jpg' },
			_id: 'mongo1',
		};
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([file]) as never,
		);
		vi.mocked(StorageFileModel.updateMany).mockResolvedValue({} as never);

		const result = await deleteFilesLogical([VALID_ID]);

		expect(StorageFileModel.updateMany).toHaveBeenCalled();
		expect(result).toHaveLength(1);
		expect(result[0]).not.toHaveProperty('_id');
	});

	it('throws when no active files found', async () => {
		vi.mocked(StorageFileModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);

		await expect(deleteFilesLogical([VALID_ID])).rejects.toThrow();
	});
});
