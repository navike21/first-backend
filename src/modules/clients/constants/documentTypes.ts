export const DOCUMENT_TYPES = [
	'DNI',
	'RUC',
	'CE',
	'NIF',
	'CIF',
	'CNPJ',
	'CPF',
	'EIN',
	'SSN',
	'VAT',
	'PASSPORT',
	'OTHER',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export const DOCUMENT_TYPES_ARRAY: [DocumentType, ...DocumentType[]] = [
	...DOCUMENT_TYPES,
];
