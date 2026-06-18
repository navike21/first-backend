import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '../infrastructure/UserGroupModel';

export async function purgeUserGroupsBulk(ids: string[]) {
	const groups = await UserGroupModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = groups.map((g) => g.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	// Membership lives in `User.groupIds`. Pull every reference to the purged
	// groups from ALL users (incl. soft-deleted) before destroying the groups,
	// so a physical purge never leaves dangling group ids.
	await UserModel.updateMany(
		{ groupIds: { $in: processedIds } },
		{ $pull: { groupIds: { $in: processedIds } } },
	);

	await UserGroupModel.deleteMany({ id: { $in: processedIds } });

	return {
		processed: groups.map((g) => cleanMongoFields(g)),
		processedIds,
		notFoundIds,
	};
}
