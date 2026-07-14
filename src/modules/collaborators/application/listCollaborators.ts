import CollaboratorModel from '../infrastructure/CollaboratorModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { escapeRegex } from '@Helpers/escapeRegex';

interface ListCollaboratorsOptions {
	page: number;
	limit: number;
	adminView?: boolean;
	search?: string;
	isActive?: boolean;
}

export async function listCollaborators({
	page,
	limit,
	adminView = false,
	search,
	isActive,
}: ListCollaboratorsOptions) {
	const filter: Record<string, unknown> = adminView
		? { deletedAt: null }
		: { status: 'active', isActive: true, deletedAt: null };

	if (search) {
		filter.name = { $regex: escapeRegex(search), $options: 'i' };
	}

	// The public view always forces isActive:true above; admins may filter by
	// visibility on top of that.
	if (adminView && isActive !== undefined) {
		filter.isActive = isActive;
	}

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
