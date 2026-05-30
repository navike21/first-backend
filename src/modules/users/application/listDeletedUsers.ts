import { DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';

export async function listDeletedUsers({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		UserModel.find({ status: DELETED }).select('-password').sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
		UserModel.countDocuments({ status: DELETED }),
	]);
	return { items: items.map(cleanMongoFields), total, page, limit, pages: Math.ceil(total / limit) };
}
