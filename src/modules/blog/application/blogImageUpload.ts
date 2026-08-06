import { uploadImageSafe } from '@Modules/storage';
import { BLOG_ENTITY_TYPE } from '../constants/paths';
import type { IncomingFile } from '@Types/incomingFile';

/** Shared upload call behind both `cover` and `ogImage` — used by
 * createBlogPost and updateBlogPost so the entityType/field wiring lives
 * in one place instead of being repeated per field per operation. */
export function uploadBlogImage(
	id: string,
	field: 'cover' | 'ogImage',
	file: IncomingFile,
	uploadedBy: string | undefined,
) {
	return uploadImageSafe({
		buffer: file.buffer,
		originalName: file.originalName,
		mimeType: file.mimeType,
		entityType: BLOG_ENTITY_TYPE,
		entityId: id,
		field,
		uploadedBy,
	});
}
