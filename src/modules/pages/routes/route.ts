import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { acceptImageFields } from '@Modules/storage';
import {
	PAGES_PATH_LIST_PUBLIC,
	PAGES_PATH_LIST_ADMIN,
	PAGES_PATH_RESOLVE_PUBLIC,
	PAGES_PATH_GET_BY_ID,
	PAGES_PATH_CREATE,
	PAGES_PATH_UPDATE,
	PAGES_PATH_DELETE,
	PAGES_PATH_DELETE_PERMANENT,
	PAGES_PATH_RESTORE,
	PAGES_PATH_TRASH,
	PAGES_PATH_SECTION_ADD,
	PAGES_PATH_SECTION_UPDATE,
	PAGES_PATH_SECTION_DELETE,
	PAGES_PATH_SECTIONS_REORDER,
	PAGES_PATH_BULK_DELETE,
	PAGES_PATH_BULK_RESTORE,
	PAGES_PATH_BULK_PURGE,
	PAGES_PATH_REVISIONS_LIST,
	PAGES_PATH_REVISIONS_RESTORE,
} from '../constants/paths';
import {
	pageListPublicController,
	pageListAdminController,
} from '../controllers/page.list';
import { pageResolvePublicController } from '../controllers/page.resolve';
import { pageGetByIdController } from '../controllers/page.getById';
import { pageCreateController } from '../controllers/page.create';
import { pageUpdateController } from '../controllers/page.update';
import { pageDeleteController } from '../controllers/page.delete';
import { pageDeletePermanentController } from '../controllers/page.deletePermanent';
import { pageRestoreController } from '../controllers/page.restore';
import { pageTrashController } from '../controllers/page.trash';
import { pageSectionAddController } from '../controllers/page.section.add';
import { pageSectionUpdateController } from '../controllers/page.section.update';
import { pageSectionDeleteController } from '../controllers/page.section.delete';
import { pageSectionReorderController } from '../controllers/page.section.reorder';
import { deletePagesBulkController } from '../controllers/page.deleteBulk';
import { restorePagesBulkController } from '../controllers/page.restoreBulk';
import { purgePagesBulkController } from '../controllers/page.purgeBulk';
import { pageRevisionsListController } from '../controllers/page.revisions.list';
import { pageRevisionsRestoreController } from '../controllers/page.revisions.restore';

export function pagesApi(router: Router) {
	router.get(PAGES_PATH_LIST_PUBLIC, pageListPublicController);
	router.get(PAGES_PATH_RESOLVE_PUBLIC, pageResolvePublicController);

	router.get(
		PAGES_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.PAGES_READ, PERMISSIONS.PAGES_MANAGE),
		pageTrashController,
	);
	router.get(
		PAGES_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.PAGES_READ, PERMISSIONS.PAGES_MANAGE),
		pageListAdminController,
	);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		PAGES_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.PAGES_DELETE, PERMISSIONS.PAGES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAGES_BULK_SOFT_DELETED,
			resource: 'pages',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deletePagesBulkController,
	);
	router.patch(
		PAGES_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAGES_BULK_RESTORED,
			resource: 'pages',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restorePagesBulkController,
	);
	router.delete(
		PAGES_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.PAGES_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAGES_BULK_PERMANENTLY_DELETED,
			resource: 'pages',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgePagesBulkController,
	);

	router.get(
		PAGES_PATH_REVISIONS_LIST,
		authenticate,
		authorize(PERMISSIONS.PAGES_READ, PERMISSIONS.PAGES_MANAGE),
		pageRevisionsListController,
	);
	router.post(
		PAGES_PATH_REVISIONS_RESTORE,
		authenticate,
		authorize(PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.PAGE_REVISION_RESTORED, resource: 'pages' }),
		pageRevisionsRestoreController,
	);

	router.get(
		PAGES_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.PAGES_READ, PERMISSIONS.PAGES_MANAGE),
		pageGetByIdController,
	);

	router.post(
		PAGES_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.PAGES_CREATE, PERMISSIONS.PAGES_MANAGE),
		...acceptImageFields(['cover', 'ogImage']),
		captureAudit({ action: AUDIT_ACTIONS.PAGES_CREATED, resource: 'pages' }),
		pageCreateController,
	);

	router.patch(
		PAGES_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.PAGES_RESTORED, resource: 'pages' }),
		pageRestoreController,
	);

	router.patch(
		PAGES_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE),
		...acceptImageFields(['cover', 'ogImage']),
		captureAudit({ action: AUDIT_ACTIONS.PAGES_UPDATED, resource: 'pages' }),
		pageUpdateController,
	);

	router.delete(
		PAGES_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.PAGES_PURGE),
		captureAudit({ action: AUDIT_ACTIONS.PAGES_PERMANENTLY_DELETED, resource: 'pages' }),
		pageDeletePermanentController,
	);
	router.delete(
		PAGES_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.PAGES_DELETE, PERMISSIONS.PAGES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.PAGES_SOFT_DELETED, resource: 'pages' }),
		pageDeleteController,
	);

	router.post(
		PAGES_PATH_SECTION_ADD,
		authenticate,
		authorize(PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE),
		pageSectionAddController,
	);
	router.put(
		PAGES_PATH_SECTIONS_REORDER,
		authenticate,
		authorize(PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE),
		pageSectionReorderController,
	);
	router.patch(
		PAGES_PATH_SECTION_UPDATE,
		authenticate,
		authorize(PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE),
		pageSectionUpdateController,
	);
	router.delete(
		PAGES_PATH_SECTION_DELETE,
		authenticate,
		authorize(PERMISSIONS.PAGES_DELETE, PERMISSIONS.PAGES_MANAGE),
		pageSectionDeleteController,
	);
}
