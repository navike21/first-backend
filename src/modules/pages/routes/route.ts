import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	PAGES_PATH_LIST_PUBLIC,
	PAGES_PATH_LIST_ADMIN,
	PAGES_PATH_GET_BY_SLUG,
	PAGES_PATH_CREATE,
	PAGES_PATH_UPDATE,
	PAGES_PATH_DELETE,
	PAGES_PATH_DELETE_PERMANENT,
	PAGES_PATH_SECTION_ADD,
	PAGES_PATH_SECTION_UPDATE,
	PAGES_PATH_SECTION_DELETE,
	PAGES_PATH_SECTIONS_REORDER,
} from '../constants/paths';
import {
	pageListPublicController,
	pageListAdminController,
} from '../controllers/page.list';
import { pageGetBySlugPublicController } from '../controllers/page.getBySlug';
import { pageCreateController } from '../controllers/page.create';
import { pageUpdateController } from '../controllers/page.update';
import { pageDeleteController } from '../controllers/page.delete';
import { pageDeletePermanentController } from '../controllers/page.deletePermanent';
import { pageSectionAddController } from '../controllers/page.section.add';
import { pageSectionUpdateController } from '../controllers/page.section.update';
import { pageSectionDeleteController } from '../controllers/page.section.delete';
import { pageSectionReorderController } from '../controllers/page.section.reorder';

export function pagesApi(router: Router) {
	router.get(PAGES_PATH_LIST_PUBLIC, pageListPublicController);

	router.get(
		PAGES_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.PAGES_READ, PERMISSIONS.PAGES_MANAGE),
		pageListAdminController,
	);

	router.get(PAGES_PATH_GET_BY_SLUG, pageGetBySlugPublicController);

	router.post(
		PAGES_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.PAGES_CREATE, PERMISSIONS.PAGES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAGES_CREATED,
			resource: 'pages',
		}),
		pageCreateController,
	);

	router.patch(
		PAGES_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.PAGES_UPDATE, PERMISSIONS.PAGES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAGES_UPDATED,
			resource: 'pages',
		}),
		pageUpdateController,
	);

	router.delete(
		PAGES_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.PAGES_DELETE, PERMISSIONS.PAGES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAGES_SOFT_DELETED,
			resource: 'pages',
		}),
		pageDeleteController,
	);

	router.delete(
		PAGES_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.PAGES_PURGE, PERMISSIONS.PAGES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAGES_PERMANENTLY_DELETED,
			resource: 'pages',
		}),
		pageDeletePermanentController,
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
