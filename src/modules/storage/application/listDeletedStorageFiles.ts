import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { VIDEO_MIME_TYPES } from '../constants/allowedMimeTypes';
import StorageFileModel from '../infrastructure/StorageFileModel';

export interface ListDeletedStorageFilesQuery {
	page: number;
	limit: number;
	kind?: 'image' | 'video';
	search?: string;
}

export async function listDeletedStorageFiles({ page, limit, kind, search }: ListDeletedStorageFilesQuery) {
	const skip = (page - 1) * limit;

	const filter: Record<string, unknown> = { deletedAt: { $ne: null } };
	if (kind === 'image') filter.isImage = true;
	if (kind === 'video') filter.mimeType = { $in: VIDEO_MIME_TYPES };
	if (search) filter.originalName = { $regex: search, $options: 'i' };

	const [items, total] = await Promise.all([
		StorageFileModel.find(filter).sort({ deletedAt: -1 }).skip(skip).limit(limit).lean(),
		StorageFileModel.countDocuments(filter),
	]);
	return {
		items: items.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
