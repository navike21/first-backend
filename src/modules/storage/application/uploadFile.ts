import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	isRasterImage,
	isSvg,
	isImageMimeType,
} from '../constants/allowedMimeTypes';
import { processRasterImage } from '../infrastructure/ImageProcessor';
import { getStorageDriver } from '../infrastructure/StorageService';
import StorageFileModel from '../infrastructure/StorageFileModel';
import type { StorageFileDocument } from '../infrastructure/StorageFileModel';

export interface UploadInput {
	buffer: Buffer;
	originalName: string;
	mimeType: string;
	entityType: string;
	entityId: string;
	quality?: number;
	uploadedBy?: string;
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

export async function uploadFile(
	input: UploadInput,
): Promise<StorageFileDocument> {
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

	let full: { pathname: string; url: string } | undefined;
	let thumb: { pathname: string; url: string } | undefined;
	const isImage = isImageMimeType(input.mimeType) || isSvg(input.mimeType);

	if (isRasterImage(input.mimeType)) {
		const { full: fullBuf, thumb: thumbBuf } = await processRasterImage(
			input.buffer,
			quality,
		);
		const [fullUploaded, thumbUploaded] = await Promise.all([
			driver.uploadBuffer(fullBuf, `${base}/full.webp`, 'image/webp'),
			driver.uploadBuffer(thumbBuf, `${base}/thumb.webp`, 'image/webp'),
		]);
		full = fullUploaded;
		thumb = thumbUploaded;
	}

	const record = await StorageFileModel.create({
		entityType: input.entityType,
		entityId: input.entityId,
		originalName: input.originalName,
		mimeType: input.mimeType,
		size: input.buffer.length,
		isImage,
		original,
		full,
		thumb,
		uploadedBy: input.uploadedBy,
	});

	return cleanMongoFields(record.toObject());
}
