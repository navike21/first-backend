import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { escapeRegex } from '@Helpers/escapeRegex';
import ShippingRuleModel from '../infrastructure/ShippingRuleModel';

interface ListShippingRulesParams {
	page: number;
	limit: number;
	isActive?: boolean;
	search?: string;
}

export async function listShippingRules({
	page,
	limit,
	isActive,
	search,
}: ListShippingRulesParams) {
	const skip = (page - 1) * limit;

	const query: Record<string, unknown> = { deletedAt: null };
	if (isActive !== undefined) query.isActive = isActive;
	if (search) {
		const pattern = escapeRegex(search);
		query.name = { $regex: pattern, $options: 'i' };
	}

	const [data, total] = await Promise.all([
		ShippingRuleModel.find(query)
			.sort({ order: 1, createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		ShippingRuleModel.countDocuments(query),
	]);

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
