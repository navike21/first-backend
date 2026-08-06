import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { acceptImageFields } from '@Modules/storage';
import {
	BLOG_PATH_LIST_PUBLIC,
	BLOG_PATH_LIST_ADMIN,
	BLOG_PATH_GET_BY_ID,
	BLOG_PATH_GET_BY_SLUG,
	BLOG_PATH_CREATE,
	BLOG_PATH_UPDATE,
	BLOG_PATH_DELETE,
	BLOG_PATH_DELETE_PERMANENT,
	BLOG_PATH_RESTORE,
	BLOG_PATH_TRASH,
	BLOG_PATH_BULK_DELETE,
	BLOG_PATH_BULK_RESTORE,
	BLOG_PATH_BULK_PURGE,
} from '../constants/paths';
import { blogListPublicController } from '../controllers/blog.listPublic';
import { blogGetBySlugController } from '../controllers/blog.getBySlug';
import { blogGetByIdController } from '../controllers/blog.getById';
import { blogListAdminController } from '../controllers/blog.listAdmin';
import { blogCreateController } from '../controllers/blog.create';
import { blogUpdateController } from '../controllers/blog.update';
import { blogDeleteController } from '../controllers/blog.delete';
import { blogDeletePermanentController } from '../controllers/blog.deletePermanent';
import { blogRestoreController } from '../controllers/blog.restore';
import { blogTrashController } from '../controllers/blog.trash';
import {
	deleteBlogPostsBulkController,
	restoreBlogPostsBulkController,
	purgeBlogPostsBulkController,
} from '../controllers/blog.bulk';

const acceptBlogMedia = () =>
	acceptImageFields([{ name: 'cover' }, { name: 'ogImage' }]);

export function blogApi(router: Router) {
	router.get(BLOG_PATH_LIST_PUBLIC, blogListPublicController);

	router.get(
		BLOG_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_MANAGE),
		blogTrashController,
	);
	router.get(
		BLOG_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_MANAGE),
		blogListAdminController,
	);
	router.get(
		BLOG_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_MANAGE),
		blogGetByIdController,
	);
	router.get(BLOG_PATH_GET_BY_SLUG, blogGetBySlugController);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		BLOG_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.BLOG_DELETE, PERMISSIONS.BLOG_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.BLOG_BULK_SOFT_DELETED,
			resource: 'blog',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteBlogPostsBulkController,
	);
	router.patch(
		BLOG_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.BLOG_UPDATE, PERMISSIONS.BLOG_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.BLOG_BULK_RESTORED,
			resource: 'blog',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreBlogPostsBulkController,
	);
	router.delete(
		BLOG_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.BLOG_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.BLOG_BULK_PERMANENTLY_DELETED,
			resource: 'blog',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeBlogPostsBulkController,
	);

	router.post(
		BLOG_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.BLOG_CREATE, PERMISSIONS.BLOG_MANAGE),
		...acceptBlogMedia(),
		captureAudit({
			action: AUDIT_ACTIONS.BLOG_CREATED,
			resource: 'blog',
		}),
		blogCreateController,
	);

	router.patch(
		BLOG_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.BLOG_UPDATE, PERMISSIONS.BLOG_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.BLOG_RESTORED,
			resource: 'blog',
		}),
		blogRestoreController,
	);

	router.patch(
		BLOG_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.BLOG_UPDATE, PERMISSIONS.BLOG_MANAGE),
		...acceptBlogMedia(),
		captureAudit({
			action: AUDIT_ACTIONS.BLOG_UPDATED,
			resource: 'blog',
		}),
		blogUpdateController,
	);

	router.delete(
		BLOG_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.BLOG_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.BLOG_PERMANENTLY_DELETED,
			resource: 'blog',
		}),
		blogDeletePermanentController,
	);
	router.delete(
		BLOG_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.BLOG_DELETE, PERMISSIONS.BLOG_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.BLOG_SOFT_DELETED,
			resource: 'blog',
		}),
		blogDeleteController,
	);
}
