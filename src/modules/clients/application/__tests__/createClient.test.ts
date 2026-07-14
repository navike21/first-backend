import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/clients/infrastructure/ClientModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock('@Helpers/uuid', () => ({ default: vi.fn(() => 'new-id') }));
vi.mock('@Modules/storage', () => ({
	uploadImageSafe: vi.fn(),
	deleteEntityFiles: vi.fn(() => Promise.resolve()),
	deleteStorageFilesByIds: vi.fn(() => Promise.resolve()),
}));

import { createClient } from '@Modules/clients/application/createClient';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import { ClientDuplicateDocumentError } from '@Modules/clients/domain/errors/ClientErrors';

const baseInput = {
	businessName: 'Acme Corp',
	clientType: 'company' as const,
	country: 'PE',
};

const withDoc = {
	...baseInput,
	documentType: 'RUC' as const,
	documentNumber: '20123456789',
};

const file = {
	buffer: Buffer.from('img'),
	originalName: 'logo.png',
	mimeType: 'image/png',
};

function mockCreatedClient(extra: Record<string, unknown> = {}) {
	const doc = { ...baseInput, id: 'new-id', _id: 'mongo-1', ...extra };
	vi.mocked(ClientModel.create).mockResolvedValue({
		...doc,
		toObject: () => doc,
	} as never);
}

describe('createClient', () => {
	beforeEach(() => vi.clearAllMocks());

	it('skips the dedup query when there is no document number', async () => {
		mockCreatedClient();

		const result = await createClient(baseInput);

		expect(ClientModel.findOne).not.toHaveBeenCalled();
		expect(ClientModel.create).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
		expect(result.warnings).toEqual([]);
	});

	it('throws ClientDuplicateDocumentError when the document already exists', async () => {
		vi.mocked(ClientModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'existing' }),
		} as never);

		await expect(createClient(withDoc)).rejects.toThrow(
			ClientDuplicateDocumentError,
		);
		expect(ClientModel.create).not.toHaveBeenCalled();
	});

	it('uploads the image and stores its url on success', async () => {
		vi.mocked(uploadImageSafe).mockResolvedValue({
			url: 'https://cdn/full.webp',
			storageId: 's1',
		});
		mockCreatedClient({ logoUrl: 'https://cdn/full.webp' });

		const result = await createClient(baseInput, file, 'user-1');

		expect(uploadImageSafe).toHaveBeenCalledWith(
			expect.objectContaining({
				entityType: 'clients',
				entityId: 'new-id',
				field: 'logo',
				uploadedBy: 'user-1',
			}),
		);
		expect(ClientModel.create).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 'new-id',
				logoUrl: 'https://cdn/full.webp',
			}),
		);
		expect(result.warnings).toEqual([]);
	});

	it('still saves the record and returns a warning when the upload fails', async () => {
		const warning = {
			field: 'logo',
			code: 'IMAGE_UPLOAD_FAILED',
			message: 'failed',
		};
		vi.mocked(uploadImageSafe).mockResolvedValue({ warning });
		mockCreatedClient();

		const result = await createClient(baseInput, file);

		expect(ClientModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ id: 'new-id', logoUrl: undefined }),
		);
		expect(result.warnings).toEqual([warning]);
	});

	it('compensates the uploaded blob when the insert fails', async () => {
		vi.mocked(uploadImageSafe).mockResolvedValue({
			url: 'https://cdn/full.webp',
			storageId: 's1',
		});
		vi.mocked(ClientModel.create).mockRejectedValue(
			Object.assign(new Error('dup'), { code: 11000 }),
		);

		await expect(createClient(baseInput, file)).rejects.toThrow();
		expect(deleteEntityFiles).toHaveBeenCalledWith('clients', 'new-id');
	});
});
