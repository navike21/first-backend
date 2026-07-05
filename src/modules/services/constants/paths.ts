/** entityType used to anchor a service's stored files (cover) in the storage module. */
export const SERVICE_ENTITY_TYPE = 'services';

export const SERVICE_PATH_LIST_PUBLIC = '/services';
export const SERVICE_PATH_LIST_ADMIN = '/services/admin';
export const SERVICE_PATH_GET_BY_SLUG = '/services/:slug';
export const SERVICE_PATH_GET_BY_ID = '/services/id/:id';
export const SERVICE_PATH_CREATE = '/services';
export const SERVICE_PATH_UPDATE = '/services/:id';
export const SERVICE_PATH_DELETE = '/services/:id';
export const SERVICE_PATH_DELETE_PERMANENT = '/services/:id/permanent';
export const SERVICE_PATH_TRASH = '/services/trash';
export const SERVICE_PATH_RESTORE = '/services/:id/restore';
export const SERVICE_PATH_BULK_DELETE = '/services/bulk';
export const SERVICE_PATH_BULK_RESTORE = '/services/bulk/restore';
export const SERVICE_PATH_BULK_PURGE = '/services/bulk/permanent';
