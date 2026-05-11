import { UserGroupModel } from '@Modules/user-groups';

export async function loadUserPermissions(groupId?: string): Promise<string[]> {
	if (!groupId) return [];
	const group = await UserGroupModel.findOne({ id: groupId });
	return group ? [...group.permissions] : [];
}
