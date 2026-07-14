import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request } from 'express';

const mockHandleUpload = vi.fn();
vi.mock('@vercel/blob/client', () => ({
	handleUpload: (...args: unknown[]) => mockHandleUpload(...args),
}));

vi.mock('@Constants/environments', () => ({
	ENV: {
		STORAGE_DRIVER: 'vercel-blob',
		STORAGE_MAX_VIDEO_SIZE_BYTES: 52428800,
	},
}));

const mockVerifyAccess = vi.fn();
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: {
		verifyAccess: (...args: unknown[]) => mockVerifyAccess(...args),
	},
}));

const mockSupportsDirectUpload = vi.fn();
vi.mock('../../infrastructure/StorageService', () => ({
	getStorageDriver: () => ({ supportsDirectUpload: mockSupportsDirectUpload }),
}));

const mockCreate = vi.fn();
vi.mock('../../infrastructure/StorageFileModel', () => ({
	default: { create: (...args: unknown[]) => mockCreate(...args) },
}));

import { requestDirectUpload } from '../directUpload';

function makeReq(body: unknown, authHeader?: string): Request {
	return {
		body,
		originalUrl: '/api/v1/storage/direct-upload',
		headers: {
			...(authHeader && { authorization: authHeader }),
			'x-forwarded-proto': 'https',
			'x-forwarded-host': 'first-backend-navike21.vercel.app',
			host: 'internal-host',
		},
	} as unknown as Request;
}

describe('requestDirectUpload', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSupportsDirectUpload.mockReturnValue(true);
		mockVerifyAccess.mockReturnValue({ sub: 'user-1' });
		mockHandleUpload.mockResolvedValue({
			type: 'blob.generate-client-token',
			clientToken: 'token',
		});
	});

	it('rejects the token-generation phase without a Bearer token', async () => {
		const req = makeReq({ type: 'blob.generate-client-token' });

		await expect(requestDirectUpload(req)).rejects.toMatchObject({
			statusCode: 401,
		});
		expect(mockHandleUpload).not.toHaveBeenCalled();
	});

	it('rejects the token-generation phase with an invalid token', async () => {
		mockVerifyAccess.mockImplementation(() => {
			throw new Error('bad token');
		});
		const req = makeReq(
			{ type: 'blob.generate-client-token' },
			'Bearer garbage',
		);

		await expect(requestDirectUpload(req)).rejects.toMatchObject({
			statusCode: 401,
		});
	});

	it('rejects when the active storage driver does not support direct upload', async () => {
		mockSupportsDirectUpload.mockReturnValue(false);
		const req = makeReq({ type: 'blob.generate-client-token' }, 'Bearer valid');

		await expect(requestDirectUpload(req)).rejects.toMatchObject({
			statusCode: 422,
		});
		expect(mockHandleUpload).not.toHaveBeenCalled();
	});

	it('calls handleUpload with allowedContentTypes/maximumSizeInBytes for a valid token request', async () => {
		const req = makeReq({ type: 'blob.generate-client-token' }, 'Bearer valid');

		await requestDirectUpload(req);

		expect(mockHandleUpload).toHaveBeenCalledTimes(1);
		const options = mockHandleUpload.mock.calls[0][0];
		const tokenConfig = await options.onBeforeGenerateToken(
			'videos/x.mp4',
			JSON.stringify({ originalName: 'clip.mp4', size: 123 }),
		);

		expect(tokenConfig.allowedContentTypes).toEqual([
			'video/mp4',
			'video/webm',
		]);
		expect(tokenConfig.maximumSizeInBytes).toBe(52428800);
		expect(JSON.parse(tokenConfig.tokenPayload)).toEqual({
			uploadedBy: 'user-1',
			originalName: 'clip.mp4',
			size: 123,
			id: undefined,
		});
		// Explicit callbackUrl (built from the forwarded headers, not
		// req.protocol/hostname) — without it, onUploadCompleted silently never
		// fires behind Vercel's proxy (confirmed via production runtime logs).
		expect(tokenConfig.callbackUrl).toBe(
			'https://first-backend-navike21.vercel.app/api/v1/storage/direct-upload',
		);
	});

	it('forwards a client-supplied id into the token payload', async () => {
		const req = makeReq({ type: 'blob.generate-client-token' }, 'Bearer valid');

		await requestDirectUpload(req);

		const options = mockHandleUpload.mock.calls[0][0];
		const tokenConfig = await options.onBeforeGenerateToken(
			'videos/x.mp4',
			JSON.stringify({
				originalName: 'clip.mp4',
				size: 123,
				id: 'client-generated-id',
			}),
		);

		expect(JSON.parse(tokenConfig.tokenPayload).id).toBe('client-generated-id');
	});

	it('does not require auth for the upload-completed webhook phase, and registers a StorageFile record', async () => {
		const req = makeReq({ type: 'blob.upload-completed' });

		await requestDirectUpload(req);

		expect(mockVerifyAccess).not.toHaveBeenCalled();
		const options = mockHandleUpload.mock.calls[0][0];
		await options.onUploadCompleted({
			blob: {
				url: 'https://blob/x.mp4',
				pathname: 'videos/x.mp4',
				contentType: 'video/mp4',
			},
			tokenPayload: JSON.stringify({
				uploadedBy: 'user-1',
				originalName: 'clip.mp4',
				size: 123,
			}),
		});

		expect(mockCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				entityType: 'editor',
				field: 'video',
				originalName: 'clip.mp4',
				mimeType: 'video/mp4',
				size: 123,
				isImage: false,
				original: { pathname: 'videos/x.mp4', url: 'https://blob/x.mp4' },
				uploadedBy: 'user-1',
			}),
		);
	});

	it('uses the client-supplied id when creating the StorageFile record', async () => {
		const req = makeReq({ type: 'blob.upload-completed' });

		await requestDirectUpload(req);

		const options = mockHandleUpload.mock.calls[0][0];
		await options.onUploadCompleted({
			blob: {
				url: 'https://blob/x.mp4',
				pathname: 'videos/x.mp4',
				contentType: 'video/mp4',
			},
			tokenPayload: JSON.stringify({
				uploadedBy: 'user-1',
				originalName: 'clip.mp4',
				size: 123,
				id: 'client-generated-id',
			}),
		});

		expect(mockCreate).toHaveBeenCalledWith(
			expect.objectContaining({ id: 'client-generated-id' }),
		);
	});
});
