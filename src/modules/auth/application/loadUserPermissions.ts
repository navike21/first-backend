import { UserGroupModel } from '@Modules/user-groups';

/**
 * Resolves a user's effective permissions as the UNION of the permissions of
 * every group they belong to. A user with no groups has no permissions.
 */
export async function loadUserPermissions(
	groupIds?: string[],
): Promise<string[]> {
	if (!groupIds || groupIds.length === 0) return [];

	const groups = await UserGroupModel.find({ id: { $in: groupIds } });

	const permissions = new Set<string>();
	for (const group of groups) {
		for (const permission of group.permissions) permissions.add(permission);
	}
	return [...permissions];
}
