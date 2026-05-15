import TeamMemberModel from '../infrastructure/TeamMemberModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

interface ListTeamOptions {
	page: number;
	limit: number;
	adminView?: boolean;
}

export async function listTeamMembers({
	page,
	limit,
	adminView = false,
}: ListTeamOptions) {
	const filter: Record<string, unknown> = adminView
		? { status: { $ne: 'deleted' } }
		: { status: 'active', isActive: true };

	const [docs, total] = await Promise.all([
		TeamMemberModel.find(filter)
			.sort({ order: 1, createdAt: 1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(),
		TeamMemberModel.countDocuments(filter),
	]);

	return {
		data: docs.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
