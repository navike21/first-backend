export const FEMALE = 'female';
export const MALE = 'male';

export type UserGender = typeof FEMALE | typeof MALE;

export const USER_GENDER_ARRAY: UserGender[] = [FEMALE, MALE];
