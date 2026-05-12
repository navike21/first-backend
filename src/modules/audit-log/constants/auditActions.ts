export const AUDIT_ACTIONS = {
	AUTH_LOGIN: 'auth:login',
	AUTH_LOGOUT: 'auth:logout',
	AUTH_PASSWORD_CHANGED: 'auth:password_changed',
	AUTH_PASSWORD_RESET: 'auth:password_reset',
	AUTH_EMAIL_VERIFIED: 'auth:email_verified',
	USERS_CREATED: 'users:created',
	USERS_UPDATED: 'users:updated',
	USERS_DELETED: 'users:deleted',
	SUBSCRIBERS_CREATED: 'subscribers:created',
	SUBSCRIBERS_UPDATED: 'subscribers:updated',
	SUBSCRIBERS_DELETED: 'subscribers:deleted',
	STORAGE_UPLOADED: 'storage:uploaded',
	STORAGE_SOFT_DELETED: 'storage:soft_deleted',
	STORAGE_PERMANENTLY_DELETED: 'storage:permanently_deleted',
	USERS_SOFT_DELETED: 'users:soft_deleted',
	USER_GROUPS_SOFT_DELETED: 'user-groups:soft_deleted',
	USER_GROUPS_CREATED: 'user-groups:created',
	USER_GROUPS_UPDATED: 'user-groups:updated',
	USER_GROUPS_DELETED: 'user-groups:deleted',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
