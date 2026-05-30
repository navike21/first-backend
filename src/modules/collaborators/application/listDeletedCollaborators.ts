import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CollaboratorModel from '../infrastructure/CollaboratorModel';

export async function listDeletedCollaborators({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [docs, total] = await Promise.all([
		CollaboratorModel.find({ status: 'deleted' }).sort({ deletedAt: -1 }).skip(skip).limit(limit).lean(),
		CollaboratorModel.countDocuments({ status: 'deleted' }),
	]);
	return {
		data: docs.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
