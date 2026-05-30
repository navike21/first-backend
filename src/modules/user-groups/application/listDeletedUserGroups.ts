import { DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserGroupModel from '../infrastructure/UserGroupModel';

export async function listDeletedUserGroups({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		UserGroupModel.find({ status: DELETED }).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
		UserGroupModel.countDocuments({ status: DELETED }),
	]);
	return { items: items.map(cleanMongoFields), total, page, limit, pages: Math.ceil(total / limit) };
}
