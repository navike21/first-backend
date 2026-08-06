/** entityType used to anchor a blog post's stored files (cover, og:image) in the storage module. */
export const BLOG_ENTITY_TYPE = 'blog';

export const BLOG_PATH_LIST_PUBLIC = '/blog';
export const BLOG_PATH_LIST_ADMIN = '/blog/admin';
export const BLOG_PATH_GET_BY_ID = '/blog/id/:id';
export const BLOG_PATH_BY_CATEGORY = '/blog/by-category/:categoryId';
export const BLOG_PATH_BY_TAG = '/blog/by-tag/:tagId';
export const BLOG_PATH_GET_BY_SLUG = '/blog/:slug';
export const BLOG_PATH_CREATE = '/blog';
export const BLOG_PATH_UPDATE = '/blog/:id';
export const BLOG_PATH_DELETE = '/blog/:id';
export const BLOG_PATH_DELETE_PERMANENT = '/blog/:id/permanent';
export const BLOG_PATH_TRASH = '/blog/trash';
export const BLOG_PATH_RESTORE = '/blog/:id/restore';
export const BLOG_PATH_BULK_DELETE = '/blog/bulk';
export const BLOG_PATH_BULK_RESTORE = '/blog/bulk/restore';
export const BLOG_PATH_BULK_PURGE = '/blog/bulk/permanent';
