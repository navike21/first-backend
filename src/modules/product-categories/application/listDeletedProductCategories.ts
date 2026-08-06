import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ProductCategoryModel from '../infrastructure/ProductCategoryModel';

export async function listDeletedProductCategories({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		ProductCategoryModel.find({ deletedAt: { $ne: null } })
			.sort({ deletedAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		ProductCategoryModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
