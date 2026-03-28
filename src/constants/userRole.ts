export const USER_ADMIN = 'admin';
export const USER_CUSTOMER = 'user';
export const USER_SUPER_ADMIN = 'superAdmin';

export type UserRoles =
	| typeof USER_ADMIN
	| typeof USER_CUSTOMER
	| typeof USER_SUPER_ADMIN;

export const USER_ROLES_ARRAY: UserRoles[] = [
	USER_ADMIN,
	USER_CUSTOMER,
	USER_SUPER_ADMIN,
];
