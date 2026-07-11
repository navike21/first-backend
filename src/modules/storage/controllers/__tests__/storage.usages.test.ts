import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const { mockFindStorageFileUsages, mockSuccessResponse, mockFindOne } = vi.hoisted(() => ({
	mockFindStorageFileUsages: vi.fn(),
	mockSuccessResponse: vi.fn(),
	mockFindOne: vi.fn(),
}));

vi.mock('@Modules/storage/application/findStorageFileUsages', () => ({
	findStorageFileUsages: mockFindStorageFileUsages,
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));
vi.mock('../../infrastructure/StorageFileModel', () => ({
	default: { findOne: mockFindOne },
}));

import { storageUsagesController } from '../storage.usages';

function buildRes(): Response {
	return { locals: {} } as unknown as Response;
}

function run(req: Request): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		storageUsagesController(req, buildRes(), next);
	});
}

describe('storageUsagesController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('resolves the display url (full over original) and returns usages', async () => {
		mockFindOne.mockReturnValue({
			lean: vi.fn().mockResolvedValue({
				id: 'file-1',
				original: { url: 'https://cdn/original.jpg' },
				full: { url: 'https://cdn/full.webp' },
			}),
		});
		mockFindStorageFileUsages.mockResolvedValue([{ module: 'clients', id: 'c1', label: 'Acme' }]);
		const req = { params: { id: 'file-1' } } as unknown as Request;

		await run(req);

		expect(mockFindStorageFileUsages).toHaveBeenCalledWith('https://cdn/full.webp');
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 200, data: [{ module: 'clients', id: 'c1', label: 'Acme' }] }),
		);
	});

	it('falls back to the original url when no full variant exists', async () => {
		mockFindOne.mockReturnValue({
			lean: vi.fn().mockResolvedValue({
				id: 'file-2',
				original: { url: 'https://cdn/video.mp4' },
			}),
		});
		mockFindStorageFileUsages.mockResolvedValue([]);
		const req = { params: { id: 'file-2' } } as unknown as Request;

		await run(req);

		expect(mockFindStorageFileUsages).toHaveBeenCalledWith('https://cdn/video.mp4');
	});

	it('rejects with a 404 when the file does not exist', async () => {
		mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
		const req = { params: { id: 'missing' } } as unknown as Request;

		await expect(run(req)).rejects.toMatchObject({ statusCode: 404 });
		expect(mockFindStorageFileUsages).not.toHaveBeenCalled();
	});
});
