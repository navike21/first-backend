export const LOCATION_PATH_LIST = '/inventory/locations';
export const LOCATION_PATH_CREATE = '/inventory/locations';
export const LOCATION_PATH_GET_BY_ID = '/inventory/locations/:id';
export const LOCATION_PATH_UPDATE = '/inventory/locations/:id';
export const LOCATION_PATH_DELETE = '/inventory/locations/:id';
export const LOCATION_PATH_DELETE_PERMANENT =
	'/inventory/locations/:id/permanent';
export const LOCATION_PATH_TRASH = '/inventory/locations/trash';
export const LOCATION_PATH_RESTORE = '/inventory/locations/:id/restore';
export const LOCATION_PATH_BULK_DELETE = '/inventory/locations/bulk';
export const LOCATION_PATH_BULK_RESTORE = '/inventory/locations/bulk/restore';
export const LOCATION_PATH_BULK_PURGE = '/inventory/locations/bulk/permanent';

// Stock is adjusted/read directly — no CRUD+trash+bulk of its own (see plan:
// "Casos de uso: adjustStock, getStockByProduct, listLocations").
export const STOCK_PATH_ADJUST = '/inventory/stock';
export const STOCK_PATH_GET_BY_PRODUCT = '/inventory/stock/:productId';
