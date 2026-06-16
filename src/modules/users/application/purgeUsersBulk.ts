import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles } from '@Modules/storage';
import UserModel from '../infrastructure/UserModel';
import { USER_ENTITY_TYPE } from '../constants/entity';
import { getSuperGroupIds } from './getSuperGroupIds';

export async function purgeUsersBulk(ids: string[], requesterId?: string) {
	// Never bulk-purge yourself or a super-admin (supers must be purged
	// individually, where the last-super-admin guard applies).
	const superGroupIds = await getSuperGroupIds();
	const targetIds = requesterId ? ids.filter((id) => id !== requesterId) : ids;

	const users = await UserModel.find({
		id: { $in: targetIds },
		deletedAt: { $ne: null },
		groupIds: { $nin: superGroupIds },
	})
		.select('-password')
		.lean();

	const processedIds = users.map((u) => u.id).filter((id): id is string => Boolean(id));
	const notFoundIds = targetIds.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await UserModel.deleteMany({ id: { $in: processedIds } });
	// Remove each purged user's stored files so no blobs are orphaned.
	await Promise.all(
		processedIds.map((id) =>
			deleteEntityFiles(USER_ENTITY_TYPE, id).catch(() => {}),
		),
	);

	return {
		processed: users.map((u) => cleanMongoFields(u)),
		processedIds,
		notFoundIds,
	};
}
