import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserGroupModel from '../infrastructure/UserGroupModel';

export async function purgeUserGroupsBulk(ids: string[]) {
	const groups = await UserGroupModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = groups.map((g) => g.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await UserGroupModel.deleteMany({ id: { $in: processedIds } });

	return {
		processed: groups.map((g) => cleanMongoFields(g)),
		processedIds,
		notFoundIds,
	};
}
