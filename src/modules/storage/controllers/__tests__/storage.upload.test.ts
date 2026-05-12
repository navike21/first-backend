import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@Shared/domain/AppError';

const { mockUploadFile, mockSuccessResponse } = vi.hoisted(() => ({
	mockUploadFile: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/storage/application/uploadFile', () => ({
	uploadFile: mockUploadFile,
}));

vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import {
	storageUploadController,
	storageUploadBulkController,
} from '../storage.upload';

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

function buildFile(): Express.Multer.File {
	return {
		fieldname: 'file',
		originalname: 'photo.jpg',
		encoding: '7bit',
		mimetype: 'image/jpeg',
		size: 1024,
		buffer: Buffer.from('data'),
		stream: null as never,
		destination: '',
		filename: '',
		path: '',
	};
}

function buildReq(overrides: Partial<Request> = {}): Request {
	return {
		body: {
			entityType: 'users',
			entityId: VALID_UUID,
			quality: '80',
		},
		...overrides,
	} as unknown as Request;
}

function run(
	controller: (req: Request, res: Response, next: NextFunction) => void,
	req: Request,
): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		controller(req, {} as Response, next);
	});
}

describe('storageUploadController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('passes AppError to next when req.file is absent', async () => {
		const req = buildReq({ file: undefined });
		await expect(run(storageUploadController, req)).rejects.toBeInstanceOf(
			AppError,
		);
	});

	it('passes AppError to next when body is invalid', async () => {
		const req = buildReq({
			file: buildFile(),
			body: { entityType: '', entityId: 'not-uuid' },
		});
		await expect(run(storageUploadController, req)).rejects.toBeInstanceOf(
			AppError,
		);
	});

	it('calls uploadFile and returns 201 on success', async () => {
		const fakeResult = { original: { pathname: 'p', url: 'u' }, isImage: true };
		mockUploadFile.mockResolvedValue(fakeResult);

		const req = buildReq({ file: buildFile() });
		await run(storageUploadController, req);

		expect(mockUploadFile).toHaveBeenCalledOnce();
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 201, data: fakeResult }),
		);
	});
});

describe('storageUploadBulkController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('passes AppError to next when req.files is empty', async () => {
		const req = buildReq({
			files: [] as Express.Multer.File[] as Request['files'],
		});
		await expect(
			run(storageUploadBulkController, req),
		).rejects.toBeInstanceOf(AppError);
	});

	it('passes AppError to next when req.files is undefined', async () => {
		const req = buildReq({ files: undefined });
		await expect(
			run(storageUploadBulkController, req),
		).rejects.toBeInstanceOf(AppError);
	});

	it('calls uploadFile for each file and returns 201', async () => {
		const fakeResult = { original: { pathname: 'p', url: 'u' }, isImage: false };
		mockUploadFile.mockResolvedValue(fakeResult);

		const files = [buildFile(), buildFile()] as Express.Multer.File[];
		const req = buildReq({ files: files as Request['files'] });
		await run(storageUploadBulkController, req);

		expect(mockUploadFile).toHaveBeenCalledTimes(2);
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 201 }),
		);
	});

	it('passes AppError to next when body is invalid', async () => {
		const files = [buildFile()] as Express.Multer.File[];
		const req = buildReq({
			files: files as Request['files'],
			body: { entityType: '!!!', entityId: 'bad' },
		});
		await expect(
			run(storageUploadBulkController, req),
		).rejects.toBeInstanceOf(AppError);
	});
});
