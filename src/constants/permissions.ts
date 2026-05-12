export const PERMISSIONS = {
	USERS_READ: 'users:read',
	USERS_CREATE: 'users:create',
	USERS_UPDATE: 'users:update',
	USERS_DELETE: 'users:delete',
	USERS_MANAGE: 'users:manage',

	USER_GROUPS_READ: 'user-groups:read',
	USER_GROUPS_CREATE: 'user-groups:create',
	USER_GROUPS_UPDATE: 'user-groups:update',
	USER_GROUPS_DELETE: 'user-groups:delete',
	USER_GROUPS_MANAGE: 'user-groups:manage',

	SUBSCRIBERS_READ: 'subscribers:read',
	SUBSCRIBERS_CREATE: 'subscribers:create',
	SUBSCRIBERS_UPDATE: 'subscribers:update',
	SUBSCRIBERS_DELETE: 'subscribers:delete',
	SUBSCRIBERS_MANAGE: 'subscribers:manage',

	PROFILE_READ: 'profile:read',
	PROFILE_UPDATE: 'profile:update',

	STORAGE_UPLOAD: 'storage:upload',
	STORAGE_DELETE: 'storage:delete',
	STORAGE_MANAGE: 'storage:manage',

	AUDIT_LOGS_READ: 'audit-logs:read',
	AUDIT_LOGS_MANAGE: 'audit-logs:manage',

	APP_SETTINGS_READ: 'app-settings:read',
	APP_SETTINGS_UPDATE: 'app-settings:update',
	APP_SETTINGS_MANAGE: 'app-settings:manage',

	ALL: '*:*',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as [
	Permission,
	...Permission[],
];

export function hasPermission(
	userPermissions: string[],
	required: Permission,
): boolean {
	if (userPermissions.includes(PERMISSIONS.ALL)) return true;

	const [resource] = required.split(':');
	if (userPermissions.includes(`${resource}:manage`)) return true;

	return userPermissions.includes(required);
}
