import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import StorageFileModel from '../infrastructure/StorageFileModel';

export interface ListStorageFilesQuery {
	page?: number;
	limit?: number;
	status?: string;
	entityType?: string;
	entityId?: string;
	uploadedBy?: string;
}

export async function listStorageFiles(query: ListStorageFilesQuery) {
	const page = query.page ?? 1;
	const limit = query.limit ?? 20;
	const skip = (page - 1) * limit;

	const filter: Record<string, unknown> = {};
	if (query.status) filter.status = query.status;
	if (query.entityType) filter.entityType = query.entityType;
	if (query.entityId) filter.entityId = query.entityId;
	if (query.uploadedBy) filter.uploadedBy = query.uploadedBy;

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
