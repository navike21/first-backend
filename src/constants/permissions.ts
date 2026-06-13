export const PERMISSIONS = {
	USERS_READ: 'users:read',
	USERS_CREATE: 'users:create',
	USERS_UPDATE: 'users:update',
	USERS_DELETE: 'users:delete',
	USERS_PURGE: 'users:purge',
	USERS_MANAGE: 'users:manage',

	USER_GROUPS_READ: 'user-groups:read',
	USER_GROUPS_CREATE: 'user-groups:create',
	USER_GROUPS_UPDATE: 'user-groups:update',
	USER_GROUPS_DELETE: 'user-groups:delete',
	USER_GROUPS_PURGE: 'user-groups:purge',
	USER_GROUPS_MANAGE: 'user-groups:manage',

	SUBSCRIBERS_READ: 'subscribers:read',
	SUBSCRIBERS_CREATE: 'subscribers:create',
	SUBSCRIBERS_UPDATE: 'subscribers:update',
	SUBSCRIBERS_DELETE: 'subscribers:delete',
	SUBSCRIBERS_PURGE: 'subscribers:purge',
	SUBSCRIBERS_MANAGE: 'subscribers:manage',

	PROFILE_READ: 'profile:read',
	PROFILE_UPDATE: 'profile:update',

	STORAGE_READ: 'storage:read',
	STORAGE_UPLOAD: 'storage:upload',
	STORAGE_UPDATE: 'storage:update',
	STORAGE_DELETE: 'storage:delete',
	STORAGE_PURGE: 'storage:purge',
	STORAGE_MANAGE: 'storage:manage',

	AUDIT_LOGS_READ: 'audit-logs:read',
	AUDIT_LOGS_MANAGE: 'audit-logs:manage',

	APP_SETTINGS_READ: 'app-settings:read',
	APP_SETTINGS_UPDATE: 'app-settings:update',
	APP_SETTINGS_MANAGE: 'app-settings:manage',

	CLIENTS_READ: 'clients:read',
	CLIENTS_CREATE: 'clients:create',
	CLIENTS_UPDATE: 'clients:update',
	CLIENTS_DELETE: 'clients:delete',
	CLIENTS_PURGE: 'clients:purge',
	CLIENTS_MANAGE: 'clients:manage',

	SERVICES_READ: 'services:read',
	SERVICES_CREATE: 'services:create',
	SERVICES_UPDATE: 'services:update',
	SERVICES_DELETE: 'services:delete',
	SERVICES_PURGE: 'services:purge',
	SERVICES_MANAGE: 'services:manage',

	PORTFOLIO_READ: 'portfolio:read',
	PORTFOLIO_CREATE: 'portfolio:create',
	PORTFOLIO_UPDATE: 'portfolio:update',
	PORTFOLIO_DELETE: 'portfolio:delete',
	PORTFOLIO_PURGE: 'portfolio:purge',
	PORTFOLIO_MANAGE: 'portfolio:manage',

	PAGES_READ: 'pages:read',
	PAGES_CREATE: 'pages:create',
	PAGES_UPDATE: 'pages:update',
	PAGES_DELETE: 'pages:delete',
	PAGES_PURGE: 'pages:purge',
	PAGES_MANAGE: 'pages:manage',

	COLLABORATORS_READ: 'collaborators:read',
	COLLABORATORS_CREATE: 'collaborators:create',
	COLLABORATORS_UPDATE: 'collaborators:update',
	COLLABORATORS_DELETE: 'collaborators:delete',
	COLLABORATORS_PURGE: 'collaborators:purge',
	COLLABORATORS_MANAGE: 'collaborators:manage',

	ALL: '*:*',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as [
	Permission,
	...Permission[],
];

/**
 * Permission set for a "super-admin" group: full access to every resource
 * EXCEPT physical destruction (`:purge`). A "super-root" uses `*:*`, which also
 * grants purge. Lets you create an all-powerful admin that still cannot
 * permanently destroy records.
 */
export const SUPER_ADMIN_PERMISSIONS = ALL_PERMISSIONS.filter(
	(p) => p !== PERMISSIONS.ALL && !p.endsWith(':purge'),
) as Permission[];

export function hasPermission(
	userPermissions: string[],
	required: Permission,
): boolean {
	if (userPermissions.includes(PERMISSIONS.ALL)) return true;

	const [resource, action] = required.split(':');
	// `:manage` grants full CRUD but NOT physical destruction. Purge requires an
	// explicit `:purge` permission (or the `*:*` super-root permission), so
	// permanently destroying records is always a deliberately granted capability.
	if (action !== 'purge' && userPermissions.includes(`${resource}:manage`)) {
		return true;
	}

	return userPermissions.includes(required);
}
