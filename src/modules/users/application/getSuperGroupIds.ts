import { PERMISSIONS } from '@Constants/permissions';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';

/** Ids of groups that grant full access (`*:*`), i.e. super-admin groups. */
export async function getSuperGroupIds(): Promise<string[]> {
	return UserGroupModel.find({ permissions: PERMISSIONS.ALL }).distinct('id');
}
