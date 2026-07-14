import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';
import { getSuperGroupIds } from './getSuperGroupIds';

export async function deleteUsersBulk(ids: string[], requesterId?: string) {
	// Never bulk-delete yourself or a super-admin (supers must be deleted
	// individually, where the last-super-admin guard applies).
	const superGroupIds = await getSuperGroupIds();
	const targetIds = requesterId ? ids.filter((id) => id !== requesterId) : ids;

	const users = await UserModel.find({
		id: { $in: targetIds },
		deletedAt: null,
		groupIds: { $nin: superGroupIds },
	})
		.select('-password')
		.lean();

	const processedIds = users
		.map((u) => u.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = targetIds.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await UserModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return {
		processed: users.map((u) => cleanMongoFields(u)),
		processedIds,
		notFoundIds,
	};
}
