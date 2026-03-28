export const ACTIVE = 'active';
export const INACTIVE = 'inactive';
export const DELETED = 'deleted';

export type StatusRegister = typeof ACTIVE | typeof INACTIVE | typeof DELETED;

export const STATUS_REGISTER_ARRAY: StatusRegister[] = [
	ACTIVE,
	INACTIVE,
	DELETED,
];
