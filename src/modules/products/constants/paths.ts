/** entityType used to anchor a product's stored files (gallery) in the storage module. */
export const PRODUCT_ENTITY_TYPE = 'products';
/** Max number of gallery photos allowed per product. */
export const PRODUCT_GALLERY_MAX_ITEMS = 10;

export const PRODUCT_PATH_LIST_PUBLIC = '/products';
export const PRODUCT_PATH_LIST_ADMIN = '/products/admin';
export const PRODUCT_PATH_GET_BY_ID = '/products/id/:id';
export const PRODUCT_PATH_GET_BY_SLUG = '/products/:slug';
export const PRODUCT_PATH_CREATE = '/products';
export const PRODUCT_PATH_UPDATE = '/products/:id';
export const PRODUCT_PATH_DELETE = '/products/:id';
export const PRODUCT_PATH_DELETE_PERMANENT = '/products/:id/permanent';
export const PRODUCT_PATH_TRASH = '/products/trash';
export const PRODUCT_PATH_RESTORE = '/products/:id/restore';
export const PRODUCT_PATH_BULK_DELETE = '/products/bulk';
export const PRODUCT_PATH_BULK_RESTORE = '/products/bulk/restore';
export const PRODUCT_PATH_BULK_PURGE = '/products/bulk/permanent';
