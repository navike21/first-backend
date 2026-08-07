import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CouponModel from '../infrastructure/CouponModel';

export async function purgeCouponsBulk(ids: string[]) {
	const docs = await CouponModel.find({
		id: { $in: ids },
		deletedAt: { $ne: null },
	}).lean();

	const processedIds = docs
		.map((d) => d.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await CouponModel.deleteMany({ id: { $in: processedIds } });

	return {
		processed: docs.map((d) => cleanMongoFields(d)),
		processedIds,
		notFoundIds,
	};
}
