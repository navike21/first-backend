import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

interface ListCollaboratorsOptions {
	page: number;
	limit: number;
	adminView?: boolean;
}

export async function listCollaborators({
	page,
	limit,
	adminView = false,
}: ListCollaboratorsOptions) {
	const filter: Record<string, unknown> = adminView
		? { deletedAt: null }
		: { status: 'active', isActive: true, deletedAt: null };

	const [docs, total] = await Promise.all([
		CollaboratorModel.find(filter)
			.sort({ order: 1, createdAt: 1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(),
		CollaboratorModel.countDocuments(filter),
	]);

	return {
		data: docs.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
