import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { escapeRegex } from '@Helpers/escapeRegex';
import { VIDEO_MIME_TYPES } from '../constants/allowedMimeTypes';
import StorageFileModel from '../infrastructure/StorageFileModel';

export interface ListStorageFilesQuery {
	page?: number;
	limit?: number;
	status?: string;
	entityType?: string;
	entityId?: string;
	uploadedBy?: string;
	kind?: 'image' | 'video';
	search?: string;
}

export async function listStorageFiles(query: ListStorageFilesQuery) {
	const page = query.page ?? 1;
	const limit = query.limit ?? 20;
	const skip = (page - 1) * limit;

	const filter: Record<string, unknown> = { deletedAt: null };
	if (query.status) filter.status = query.status;
	if (query.entityType) filter.entityType = query.entityType;
	if (query.entityId) filter.entityId = query.entityId;
	if (query.uploadedBy) filter.uploadedBy = query.uploadedBy;
	if (query.kind === 'image') filter.isImage = true;
	if (query.kind === 'video') filter.mimeType = { $in: VIDEO_MIME_TYPES };
	if (query.search) filter.originalName = { $regex: escapeRegex(query.search), $options: 'i' };

	const [items, total] = await Promise.all([
		StorageFileModel.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		StorageFileModel.countDocuments(filter),
	]);

	return {
		items: items.map(cleanMongoFields),
		meta: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	};
}
