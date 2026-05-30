import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PageModel from '../infrastructure/PageModel';

export async function listDeletedPages({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		PageModel.find({ status: 'deleted' }).sort({ deletedAt: -1 }).skip(skip).limit(limit).lean(),
		PageModel.countDocuments({ status: 'deleted' }),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
