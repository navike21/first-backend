export const CLIENT_TYPE_PERSON = 'person';
export const CLIENT_TYPE_COMPANY = 'company';
export const CLIENT_TYPE_ORGANIZATION = 'organization';
export const CLIENT_TYPE_GOVERNMENT = 'government';

export type ClientType =
	| typeof CLIENT_TYPE_PERSON
	| typeof CLIENT_TYPE_COMPANY
	| typeof CLIENT_TYPE_ORGANIZATION
	| typeof CLIENT_TYPE_GOVERNMENT;

export const CLIENT_TYPE_ARRAY: ClientType[] = [
	CLIENT_TYPE_PERSON,
	CLIENT_TYPE_COMPANY,
	CLIENT_TYPE_ORGANIZATION,
	CLIENT_TYPE_GOVERNMENT,
];
