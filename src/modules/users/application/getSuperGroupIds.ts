import { PERMISSIONS } from '@Constants/permissions';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';

/** Ids of groups that grant full access (`*:*`), i.e. super-admin groups. */
export async function getSuperGroupIds(): Promise<string[]> {
	// `find().select().lean()` instead of `.distinct()`: the prod connection uses
	// MongoDB Stable API v1 (strict), which rejects the `distinct` command.
	const groups = await UserGroupModel.find({ permissions: PERMISSIONS.ALL })
		.select('id')
		.lean();
	return groups.map((g) => g.id);
}
