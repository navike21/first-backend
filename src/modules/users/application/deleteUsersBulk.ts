import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';

export async function deleteUsersBulk(ids: string[]) {
	const users = await UserModel.find({ id: { $in: ids }, deletedAt: null })
		.select('-password')
		.lean();

	const processedIds = users.map((u) => u.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

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
