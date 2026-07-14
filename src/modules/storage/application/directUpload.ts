import { handleUpload } from '@vercel/blob/client';
import type { HandleUploadBody } from '@vercel/blob/client';
import type { Request } from 'express';
import generateUUID from '@Helpers/uuid';
import { ENV } from '@Constants/environments';
import { AppError } from '@Shared/domain/AppError';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { getStorageDriver } from '../infrastructure/StorageService';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';
import { VIDEO_MIME_TYPES } from '../constants/allowedMimeTypes';
import StorageFileModel from '../infrastructure/StorageFileModel';

interface ClientPayload {
	originalName?: string;
	size?: number;
	/** Client-generated id so it can reference this record right after upload
	 * (e.g. to attach a cover image) without waiting on a round-trip — see
	 * attachVideoCover.ts. Falls back to Mongoose's default when absent. */
	id?: string;
}

interface TokenPayload {
	uploadedBy?: string;
	originalName: string;
	size: number;
	id?: string;
}

/**
 * The same route serves two very different callers:
 * - the browser, requesting a client token (authenticated via our own JWT —
 *   checked here manually since the route itself can't carry `authenticate`
 *   middleware, see below);
 * - Vercel's own servers, calling back once the upload lands directly in
 *   blob storage (verified internally by `handleUpload` via the read-write
 *   token, NOT by our JWT — this call never carries a user's Bearer token).
 * Mirrors `uploadEditorImage`: authenticated (any logged-in user), no extra
 * permission beyond login.
 */
export async function requestDirectUpload(req: Request) {
	const body = req.body as HandleUploadBody;

	let uploadedBy: string | undefined;
	if (body.type === 'blob.generate-client-token') {
		const authHeader = req.headers.authorization;
		if (!authHeader?.startsWith('Bearer ')) {
			AppError.unauthorized('UNAUTHORIZED', 'Authentication required');
		}
		try {
			uploadedBy = JwtService.verifyAccess(authHeader.split(' ')[1]).sub;
		} catch {
			AppError.unauthorized('INVALID_TOKEN', 'Invalid or expired token');
		}
	}

	const driver = getStorageDriver();
	if (!driver.supportsDirectUpload()) {
		AppError.unprocessable(
			STORAGE_ERRORS.DIRECT_UPLOAD_NOT_SUPPORTED,
			`Direct upload is not supported by the '${ENV.STORAGE_DRIVER}' storage driver`,
		);
	}

	// handleUpload can't reliably auto-detect a callback URL behind Vercel's
	// proxy (confirmed in production logs: "no callbackUrl could be
	// determined" — onUploadCompleted never fires without it, silently
	// skipping the StorageFile record). Read the forwarded headers directly
	// rather than req.protocol/req.hostname, which depend on Express's
	// `trust proxy` setting (not configured here) to be accurate.
	const proto =
		(req.headers['x-forwarded-proto'] as string | undefined) ?? 'https';
	const host =
		(req.headers['x-forwarded-host'] as string | undefined) ?? req.headers.host;
	const callbackUrl = `${proto}://${host}${req.originalUrl}`;

	return handleUpload({
		body,
		request: req,
		onBeforeGenerateToken: async (_pathname, clientPayloadRaw) => {
			const clientPayload: ClientPayload = clientPayloadRaw
				? (JSON.parse(clientPayloadRaw) as ClientPayload)
				: {};
			const tokenPayload: TokenPayload = {
				uploadedBy,
				originalName: clientPayload.originalName ?? 'video',
				size: clientPayload.size ?? 0,
				id: clientPayload.id,
			};
			return {
				allowedContentTypes: [...VIDEO_MIME_TYPES],
				maximumSizeInBytes: ENV.STORAGE_MAX_VIDEO_SIZE_BYTES,
				tokenPayload: JSON.stringify(tokenPayload),
				callbackUrl,
			};
		},
		onUploadCompleted: async ({ blob, tokenPayload: tokenPayloadRaw }) => {
			const payload: TokenPayload = tokenPayloadRaw
				? (JSON.parse(tokenPayloadRaw) as TokenPayload)
				: { originalName: 'video', size: 0 };
			await StorageFileModel.create({
				...(payload.id ? { id: payload.id } : {}),
				entityType: 'editor',
				entityId: generateUUID(),
				field: 'video',
				originalName: payload.originalName,
				mimeType: blob.contentType,
				size: payload.size,
				isImage: false,
				original: { pathname: blob.pathname, url: blob.url },
				uploadedBy: payload.uploadedBy,
			});
		},
	});
}
