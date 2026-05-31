import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserGroupModel from '../infrastructure/UserGroupModel';

export async function restoreUserGroupsBulk(ids: string[]) {
	const groups = await UserGroupModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = groups.map((g) => g.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await UserGroupModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);

	return {
		processed: groups.map((g) => cleanMongoFields({ ...g, deletedAt: undefined })),
		processedIds,
		notFoundIds,
	};
}
