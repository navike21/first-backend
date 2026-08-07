export const PRODUCT_STATUSES = ['draft', 'active', 'archived'] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
export const PRODUCT_STATUSES_ARRAY: [ProductStatus, ...ProductStatus[]] = [
	...PRODUCT_STATUSES,
];
