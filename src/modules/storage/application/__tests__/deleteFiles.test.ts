import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDelete = vi.fn();

vi.mock('@Modules/storage/infrastructure/StorageService', () => ({
	getStorageDriver: vi.fn(() => ({
		delete: mockDelete,
		uploadBuffer: vi.fn(),
	})),
}));

import { deleteFiles } from '../deleteFiles';

describe('deleteFiles', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls driver.delete for each url', async () => {
		mockDelete.mockResolvedValue(undefined);
		const urls = [
			'https://cdn.example.com/file1.jpg',
			'https://cdn.example.com/file2.webp',
		];

		await deleteFiles(urls);

		expect(mockDelete).toHaveBeenCalledTimes(2);
		expect(mockDelete).toHaveBeenCalledWith(urls[0]);
		expect(mockDelete).toHaveBeenCalledWith(urls[1]);
	});

	it('resolves for an empty urls array', async () => {
		await expect(deleteFiles([])).resolves.toBeUndefined();
		expect(mockDelete).not.toHaveBeenCalled();
	});

	it('propagates driver errors', async () => {
		mockDelete.mockRejectedValue(new Error('delete failed'));

		await expect(
			deleteFiles(['https://cdn.example.com/file.jpg']),
		).rejects.toThrow('delete failed');
	});
});
