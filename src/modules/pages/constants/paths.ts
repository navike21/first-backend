/** entityType used to anchor a page's stored files (cover) in the storage module. */
export const PAGE_ENTITY_TYPE = 'pages';

export const PAGES_PATH_LIST_PUBLIC = '/pages';
export const PAGES_PATH_LIST_ADMIN = '/pages/admin';
export const PAGES_PATH_RESOLVE_PUBLIC = '/pages/resolve';
export const PAGES_PATH_GET_BY_ID = '/pages/:id';
export const PAGES_PATH_CREATE = '/pages';
export const PAGES_PATH_UPDATE = '/pages/:id';
export const PAGES_PATH_DELETE = '/pages/:id';
export const PAGES_PATH_SECTION_ADD = '/pages/:id/sections';
export const PAGES_PATH_SECTION_UPDATE = '/pages/:id/sections/:sectionId';
export const PAGES_PATH_SECTION_DELETE = '/pages/:id/sections/:sectionId';
export const PAGES_PATH_SECTIONS_REORDER = '/pages/:id/sections/reorder';
export const PAGES_PATH_DELETE_PERMANENT = '/pages/:id/permanent';
export const PAGES_PATH_TRASH = '/pages/trash';
export const PAGES_PATH_RESTORE = '/pages/:id/restore';
export const PAGES_PATH_BULK_DELETE = '/pages/bulk';
export const PAGES_PATH_BULK_RESTORE = '/pages/bulk/restore';
export const PAGES_PATH_BULK_PURGE = '/pages/bulk/permanent';
export const PAGES_PATH_REVISIONS_LIST = '/pages/:id/revisions';
export const PAGES_PATH_REVISIONS_RESTORE = '/pages/:id/revisions/:revisionId/restore';
