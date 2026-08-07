import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { escapeRegex } from '@Helpers/escapeRegex';
import CouponModel from '../infrastructure/CouponModel';

interface ListCouponsParams {
	page: number;
	limit: number;
	status?: string;
	search?: string;
}

export async function listCoupons({
	page,
	limit,
	status,
	search,
}: ListCouponsParams) {
	const skip = (page - 1) * limit;

	const query: Record<string, unknown> = { deletedAt: null };
	if (status) query.status = status;
	if (search) {
		const pattern = escapeRegex(search);
		query.code = { $regex: pattern, $options: 'i' };
	}

	const [data, total] = await Promise.all([
		CouponModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
		CouponModel.countDocuments(query),
	]);

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
