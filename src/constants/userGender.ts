export const FEMALE = 'female';
export const MALE = 'male';
export const OTHER = 'other';
export const PREFER_NOT_TO_SAY = 'prefer_not_to_say';

export type UserGender =
	| typeof FEMALE
	| typeof MALE
	| typeof OTHER
	| typeof PREFER_NOT_TO_SAY;

export const USER_GENDER_ARRAY: [UserGender, ...UserGender[]] = [
	FEMALE,
	MALE,
	OTHER,
	PREFER_NOT_TO_SAY,
];
