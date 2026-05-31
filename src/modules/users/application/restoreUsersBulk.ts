import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';

export async function restoreUsersBulk(ids: string[]) {
	const users = await UserModel.find({ id: { $in: ids }, deletedAt: { $ne: null } })
		.select('-password')
		.lean();

	const processedIds = users.map((u) => u.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await UserModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);

	return {
		processed: users.map((u) => cleanMongoFields({ ...u, deletedAt: undefined })),
		processedIds,
		notFoundIds,
	};
}
