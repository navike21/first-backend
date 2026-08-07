import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { escapeRegex } from '@Helpers/escapeRegex';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import ProductModel from '../infrastructure/ProductModel';
import type { ProductStatus } from '../constants/productStatus';

interface ListProductsAdminParams {
	page: number;
	limit: number;
	search?: string;
	status?: ProductStatus;
	categoryId?: string;
	tagId?: string;
}

export async function listProductsAdmin({
	page,
	limit,
	search,
	status,
	categoryId,
	tagId,
}: ListProductsAdminParams) {
	const skip = (page - 1) * limit;
	const query: Record<string, unknown> = { deletedAt: null };
	if (status) query.status = status;
	if (categoryId) query.categoryIds = categoryId;
	if (tagId) query.tagIds = tagId;
	if (search) {
		const pattern = escapeRegex(search);
		query.$or = [
			...SUPPORTED_LANGUAGES.map((lang) => ({
				[`name.${lang}`]: { $regex: pattern, $options: 'i' },
			})),
			{ sku: { $regex: pattern, $options: 'i' } },
		];
	}

	const [data, total] = await Promise.all([
		ProductModel.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		ProductModel.countDocuments(query),
	]);

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
