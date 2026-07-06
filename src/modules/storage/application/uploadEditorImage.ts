import generateUUID from '@Helpers/uuid';
import { AppError } from '@Shared/domain/AppError';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult } from '@Types/responseStructure';
import { uploadImageSafe } from './uploadImageSafe';

export async function uploadEditorImage(
	file: IncomingFile | undefined,
	uploadedBy?: string,
): Promise<MutationResult<{ url: string | null }>> {
	if (!file) AppError.badRequest('FILE_REQUIRED', 'No image file was provided');

	const entityId = generateUUID();
	const { url, warning } = await uploadImageSafe({
		buffer: file.buffer,
		originalName: file.originalName,
		mimeType: file.mimeType,
		entityType: 'editor',
		entityId,
		field: 'image',
		uploadedBy,
	});

	return {
		data: { url: url ?? null },
		warnings: warning ? [warning] : [],
	};
}
