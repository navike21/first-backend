import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import ShippingRuleModel from '../infrastructure/ShippingRuleModel';

export async function listDeletedShippingRules({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		ShippingRuleModel.find({ deletedAt: { $ne: null } })
			.sort({ deletedAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		ShippingRuleModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
