import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/clients/infrastructure/ClientModel', () => ({
	default: { findOne: vi.fn() },
}));
vi.mock('@Modules/storage', () => ({
	uploadImageSafe: vi.fn(),
	deleteEntityFiles: vi.fn(() => Promise.resolve()),
	deleteStorageFilesByIds: vi.fn(() => Promise.resolve()),
}));

import { updateClient } from '@Modules/clients/application/updateClient';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
} from '@Modules/storage';
import {
	ClientNotFoundError,
	ClientDuplicateDocumentError,
} from '@Modules/clients/domain/errors/ClientErrors';

const file = {
	buffer: Buffer.from('img'),
	originalName: 'logo.png',
	mimeType: 'image/png',
};

function makeClientDoc(overrides: Record<string, unknown> = {}) {
	const doc: Record<string, unknown> = {
		id: '1',
		businessName: 'Old Name',
		country: 'PE',
		documentType: undefined,
		documentNumber: undefined,
		save: vi.fn().mockResolvedValue(undefined),
		toObject: () => ({ id: '1', businessName: 'New Name', _id: 'mongo1' }),
		...overrides,
	};
	return doc;
}

/** assertClientUnique runs a findOne(...).lean() only when a document number exists. */
function leanResult(value: unknown) {
	return { lean: vi.fn().mockResolvedValue(value) };
}

describe('updateClient', () => {
	beforeEach(() => vi.clearAllMocks());

	it('updates and returns the client (no document, no file)', async () => {
		const doc = makeClientDoc();
		vi.mocked(ClientModel.findOne).mockResolvedValueOnce(doc as never);

		const result = await updateClient('1', { businessName: 'New Name' });

		expect(doc.save).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
		expect(result.warnings).toEqual([]);
	});

	it('throws ClientNotFoundError when the client does not exist', async () => {
		vi.mocked(ClientModel.findOne).mockResolvedValueOnce(null as never);

		await expect(
			updateClient('x', { businessName: 'X' }),
		).rejects.toThrow(ClientNotFoundError);
	});

	it('throws ClientDuplicateDocumentError when the new document collides', async () => {
		const doc = makeClientDoc();
		// 1st findOne: load the client (resolves doc). 2nd: dedup query (.lean()).
		vi.mocked(ClientModel.findOne)
			.mockResolvedValueOnce(doc as never)
			.mockReturnValueOnce(leanResult({ id: '2' }) as never);

		await expect(
			updateClient('1', { documentType: 'RUC', documentNumber: '20123456789' }),
		).rejects.toThrow(ClientDuplicateDocumentError);
	});

	it('replaces the image: uploads new, keeps it, removes the previous variants', async () => {
		const doc = makeClientDoc();
		vi.mocked(ClientModel.findOne).mockResolvedValueOnce(doc as never);
		vi.mocked(uploadImageSafe).mockResolvedValue({
			url: 'https://cdn/new.webp',
			storageId: 'new-storage',
		});

		const result = await updateClient('1', {}, file, 'user-1');

		expect(doc.logoUrl).toBe('https://cdn/new.webp');
		expect(deleteEntityFiles).toHaveBeenCalledWith('clients', '1', {
			exceptStorageIds: ['new-storage'],
		});
		expect(result.warnings).toEqual([]);
	});

	it('keeps the old image and warns when the new upload fails', async () => {
		const doc = makeClientDoc({ logoUrl: 'https://cdn/old.webp' });
		vi.mocked(ClientModel.findOne).mockResolvedValueOnce(doc as never);
		const warning = {
			field: 'logo',
			code: 'IMAGE_UPLOAD_FAILED',
			message: 'failed',
		};
		vi.mocked(uploadImageSafe).mockResolvedValue({ warning });

		const result = await updateClient('1', {}, file);

		expect(doc.logoUrl).toBe('https://cdn/old.webp');
		expect(deleteEntityFiles).not.toHaveBeenCalled();
		expect(result.warnings).toEqual([warning]);
	});

	it('compensates the new blob when save fails after a successful upload', async () => {
		const doc = makeClientDoc({
			save: vi.fn().mockRejectedValue(new Error('save failed')),
		});
		vi.mocked(ClientModel.findOne).mockResolvedValueOnce(doc as never);
		vi.mocked(uploadImageSafe).mockResolvedValue({
			url: 'https://cdn/new.webp',
			storageId: 'new-storage',
		});

		await expect(updateClient('1', {}, file)).rejects.toThrow('save failed');
		expect(deleteStorageFilesByIds).toHaveBeenCalledWith(['new-storage']);
		expect(deleteEntityFiles).not.toHaveBeenCalled();
	});
});
