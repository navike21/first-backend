import generateUUID from '@Helpers/uuid';
import { isRasterImage, isSvg, isImageMimeType } from '../constants/allowedMimeTypes';
import { processRasterImage } from '../infrastructure/ImageProcessor';
import { getStorageDriver } from '../infrastructure/StorageService';
import type { UploadResult } from '../domain/StorageDriver';

export interface UploadInput {
	buffer: Buffer;
	originalName: string;
	mimeType: string;
	entityType: string;
	entityId: string;
	quality?: number;
}

const DEFAULT_QUALITY = 80;
const ORIGINAL_EXT_MAP: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/svg+xml': 'svg',
	'application/pdf': 'pdf',
	'application/msword': 'doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		'docx',
	'application/vnd.ms-excel': 'xls',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

export async function uploadFile(input: UploadInput): Promise<UploadResult> {
	const driver = getStorageDriver();
	const quality = input.quality ?? DEFAULT_QUALITY;
	const uuid = generateUUID();
	const ext = ORIGINAL_EXT_MAP[input.mimeType] ?? 'bin';
	const base = `${input.entityType}/${input.entityId}/${uuid}`;

	const original = await driver.uploadBuffer(
		input.buffer,
		`${base}/original.${ext}`,
		input.mimeType,
	);

	if (isRasterImage(input.mimeType)) {
		const { full: fullBuf, thumb: thumbBuf } = await processRasterImage(
			input.buffer,
			quality,
		);
		const [full, thumb] = await Promise.all([
			driver.uploadBuffer(fullBuf, `${base}/full.webp`, 'image/webp'),
			driver.uploadBuffer(thumbBuf, `${base}/thumb.webp`, 'image/webp'),
		]);
		return {
			original,
			full,
			thumb,
			mimeType: input.mimeType,
			size: input.buffer.length,
			isImage: true,
		};
	}

	return {
		original,
		mimeType: input.mimeType,
		size: input.buffer.length,
		isImage: isImageMimeType(input.mimeType) || isSvg(input.mimeType),
	};
}
